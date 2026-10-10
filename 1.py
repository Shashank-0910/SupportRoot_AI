"""
╔══════════════════════════════════════════════════════════════════════════════╗
║        JANTA KI AWAAZ — V11  (Blender 5.2 LTS COMPATIBLE)                 ║
║        Run: Text Editor → Run Script                                        ║
║                                                                              ║
║  BLENDER 5.2 LTS FIXES vs previous version:                                 ║
║  A. set_interpolation() fully rewritten — uses get_fcurves_compat()          ║
║     which handles BOTH old action.fcurves (< 4.4) AND new slotted           ║
║     action.layers[0].strips[0].channelbag(slot).fcurves (4.4 / 5.x)        ║
║  B. Global keyframe interpolation set to BEZIER before ANY kf() call        ║
║     (belt-and-suspenders — works even if fcurve access fails)               ║
║  C. mat.blend_method removed (API gone in 4.2+); replaced with              ║
║     mat.surface_render_method = 'BLENDED' inside try/except                 ║
║  D. clear_anim() guarded with hasattr() to never crash on constraints       ║
║                                                                              ║
║  ANIMATION FIXES vs V10:                                                     ║
║  1. Photos never clip — Z=8.0, 16:9 scale, rail X-wander ±0.3              ║
║  2. Camera starts behind photos (rail Y=-16, photo Y starts at 2)           ║
║  3. Photo tour slowed: frame 1→300 (10 s, ~1.7 s per photo)                ║
║  4. Aim target Z=7.5 so camera looks AT photo centres                       ║
║  5. India reveal centred + correct scale sequence                            ║
║  6. Globe eases in after India exits, stays inside frame                    ║
║  7. Logo travels lower-right → behind globe → upper-left                   ║
║  8. Frame end = 570 for clean final hold                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import bpy
import math
from pathlib import Path
from mathutils import Vector

# ─────────────────────────────────────────────────────────────────────────────
# USER PATHS  — only change these two lines
# ─────────────────────────────────────────────────────────────────────────────
OUT_DIR   = Path(r"C:\Users\HP\janta-news-intro\Blender")
LOGO_PATH = Path(r"C:\Users\HP\janta-news-intro\public\logo.png")

# ─────────────────────────────────────────────────────────────────────────────
# SCENE BASE SETTINGS
# ─────────────────────────────────────────────────────────────────────────────
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end   = 570          # 19 s @ 30 fps
scene.render.fps  = 30
scene.render.resolution_x          = 1920
scene.render.resolution_y          = 1080
scene.render.resolution_percentage = 100

# ─────────────────────────────────────────────────────────────────────────────
# BLENDER 5.2 FIX C — Set global keyframe interpolation to BEZIER NOW
# Every subsequent keyframe_insert() call will automatically use BEZIER.
# This is the safest approach; it works regardless of Action API version.
# ─────────────────────────────────────────────────────────────────────────────
bpy.context.preferences.edit.keyframe_new_interpolation_type = 'BEZIER'

# ═══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

print("Blender version:", bpy.app.version_string)
print("FFmpeg supported:", bpy.app.ffmpeg.supported)
print("Media types:", bpy.types.ImageFormatSettings.bl_rna.properties["media_type"].enum_items.keys())



def get_obj(*names):
    """Return first existing object matching any name in *names."""
    for n in names:
        o = bpy.data.objects.get(n)
        if o:
            return o
    return None


def remove_obj(name):
    o = bpy.data.objects.get(name)
    if o:
        bpy.data.objects.remove(o, do_unlink=True)


def kf(obj, data_path, frame):
    """Insert a keyframe (uses global BEZIER interpolation set above)."""
    obj.keyframe_insert(data_path=data_path, frame=frame)


def clear_anim(obj):
    """Safely clear animation data — works on Objects; skips Constraints."""
    if obj is None:
        return
    # Constraints don't have animation_data; guard with hasattr.
    if hasattr(obj, 'animation_data') and obj.animation_data:
        obj.animation_data_clear()


# ─────────────────────────────────────────────────────────────────────────────
# BLENDER 5.2 FIX A — Cross-version fcurve access
# ─────────────────────────────────────────────────────────────────────────────

def get_fcurves_compat(action, slot=None):
    """
    Return the fcurve list from an Action in a version-safe way.

    Blender < 4.4  →  action.fcurves   (flat list, direct attribute)
    Blender 4.4+   →  slotted actions:
                       action.layers[0].strips[0].channelbag(slot).fcurves
    Returns an empty list if nothing is found, never raises.
    """
    # ── Legacy path (< Blender 4.4) ──────────────────────────────────────────
    if hasattr(action, 'fcurves'):
        return action.fcurves

    # ── Slotted-action path (Blender 4.4 / 5.x) ──────────────────────────────
    try:
        layers = action.layers
        if not layers:
            return []
        strips = layers[0].strips
        if not strips:
            return []
        strip = strips[0]
        if slot is None:
            slots = getattr(action, 'slots', [])
            slot  = slots[0] if slots else None
        if slot is None:
            return []
        cb = strip.channelbag(slot)
        if cb is None:
            return []
        return cb.fcurves
    except Exception:
        return []


def set_interpolation(obj_or_constraint, data_path, interp="BEZIER"):
    """
    Set keyframe interpolation on all keyframes of data_path.

    Handles:
      • bpy.types.Object     — animation_data lives directly on the object
      • bpy.types.Constraint — animation_data lives on obj.id_data (the owner)
    Compatible with Blender < 4.4 (action.fcurves) and 4.4 / 5.x (channelbag).
    Safe to call even if no keyframes exist yet.
    """
    # Resolve the owning Object (constraints point back via id_data)
    try:
        id_obj = obj_or_constraint.id_data   # constraint → its owner Object
    except AttributeError:
        id_obj = obj_or_constraint

    ad = getattr(id_obj, 'animation_data', None)
    if ad is None or ad.action is None:
        return

    action = ad.action
    slot   = getattr(ad, 'action_slot', None)   # None on Blender < 4.4

    for fc in get_fcurves_compat(action, slot):
        # Match exact path  OR  suffix  (e.g. 'constraints["…"].offset_factor')
        if fc.data_path == data_path or fc.data_path.endswith('.' + data_path):
            for kp in fc.keyframe_points:
                kp.interpolation = interp


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 1 — CAMERA
# ═══════════════════════════════════════════════════════════════════════════════

camera = get_obj("JANTA FINAL CAMERA", "JANTA CINEMATIC CAMERA", "JANTA BROADCAST CAMERA")
if camera is None:
    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.name = "JANTA FINAL CAMERA"

scene.camera          = camera
camera.data.lens      = 40      # 40 mm mild telephoto — photos look flat & crisp
camera.data.clip_start = 0.1
camera.data.clip_end   = 500.0

# Clear old animation and constraints
clear_anim(camera)
for c in list(camera.constraints):
    camera.constraints.remove(c)

# Remove stale path/aim objects from any previous version
for stale in ["V10 CINEMATIC CAMERA RAIL", "V10 CAMERA AIM",
              "V11 CAMERA RAIL",            "V11 CAMERA AIM"]:
    remove_obj(stale)

# ── Camera Rail (Bezier curve) ────────────────────────────────────────────────
# X wander ±0.3 — tight enough that photos never slip outside the frustum.
# Rail starts at Y=-16 so frame 1 is fully BEHIND the first photo.
curve_data = bpy.data.curves.new("V11 CAMERA RAIL", "CURVE")
curve_data.dimensions  = "3D"
curve_data.resolution_u = 32
spline = curve_data.splines.new("BEZIER")

rail_pts = [
    ( 0.0, -16.0, 7.0),   # start — camera behind photo zone
    (-0.2,  -1.0, 7.2),
    ( 0.3,  13.0, 7.4),   # photo bay 1
    (-0.2,  26.0, 7.5),   # photo bay 2
    ( 0.3,  39.0, 7.6),   # photo bay 3
    (-0.2,  52.0, 7.7),   # photo bay 4
    ( 0.2,  65.0, 7.8),   # photo bay 5
    (-0.1,  75.0, 7.9),   # transition
    ( 0.0,  82.0, 8.0),
    ( 0.0,  88.0, 8.2),   # globe approach
]
spline.bezier_points.add(len(rail_pts) - 1)
for bp, co in zip(spline.bezier_points, rail_pts):
    bp.co               = co
    bp.handle_left_type  = "AUTO"
    bp.handle_right_type = "AUTO"

rail_obj = bpy.data.objects.new("V11 CAMERA RAIL", curve_data)
bpy.context.collection.objects.link(rail_obj)

# ── Follow-path constraint ────────────────────────────────────────────────────
follow                    = camera.constraints.new("FOLLOW_PATH")
follow.name               = "V11 DOLLY"
follow.target             = rail_obj
follow.use_curve_follow   = False
follow.use_fixed_location = True

follow.offset_factor = 0.0;  kf(follow, "offset_factor", 1)
follow.offset_factor = 0.72; kf(follow, "offset_factor", 300)
follow.offset_factor = 0.88; kf(follow, "offset_factor", 380)
follow.offset_factor = 0.96; kf(follow, "offset_factor", 420)
follow.offset_factor = 1.0;  kf(follow, "offset_factor", 570)
set_interpolation(follow, "offset_factor", "BEZIER")

# ── Camera Aim Empty ──────────────────────────────────────────────────────────
# Z=7.5 → camera looks directly at photo centres, not above or below them.
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, 10, 7.5))
aim                    = bpy.context.object
aim.name               = "V11 CAMERA AIM"
aim.empty_display_size = 0.3

aim_kfs = [
    (  1, ( 0.0,  10.0, 7.5)),
    ( 60, ( 0.2,  25.0, 7.5)),
    (120, (-0.2,  38.0, 7.5)),
    (180, ( 0.2,  51.0, 7.5)),
    (240, (-0.1,  64.0, 7.5)),
    (300, ( 0.0,  77.0, 7.5)),
    (340, ( 0.0,  90.0, 7.8)),
    (380, ( 0.0, 108.0, 8.0)),
    (420, ( 0.0, 115.0, 8.0)),
    (570, ( 0.0, 115.0, 8.0)),
]
for frame, loc in aim_kfs:
    aim.location = loc
    kf(aim, "location", frame)
set_interpolation(aim, "location", "BEZIER")

track_con             = camera.constraints.new("TRACK_TO")
track_con.name        = "V11 LOOK"
track_con.target      = aim
track_con.track_axis  = "TRACK_NEGATIVE_Z"
track_con.up_axis     = "UP_Y"


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 2 — PHOTO PLANES
# All photos: Z-centre = 8.0 (camera height), 16:9 scale, X-stagger ±1.5.
# Photos are STATIC — camera dolly moves past them; no animation on photos.
# ═══════════════════════════════════════════════════════════════════════════════

PHOTO_NAMES = [
    ("PHOTO FARMERS",  "IMG_Farmers"),
    ("PHOTO MARKET",   "IMG_Market"),
    ("PHOTO STUDENT",  "IMG_Student"),
    ("PHOTO TECH",     "IMG_Tech"),
    ("PHOTO SOCIETY",  "IMG_Society"),
    ("PHOTO EXTRA1",   "IMG_Extra1"),
]
PHOTO_POSITIONS = [
    (-1.5,  2.0, 8.0),
    ( 1.5, 15.0, 8.0),
    (-1.5, 28.0, 8.0),
    ( 1.5, 41.0, 8.0),
    (-1.5, 54.0, 8.0),
    ( 1.5, 67.0, 8.0),
]
PHOTO_SCALE = (2.8, 1.575, 1.0)   # 16:9 aspect ratio

for (obj_name, fallback), pos in zip(PHOTO_NAMES, PHOTO_POSITIONS):
    photo = get_obj(obj_name, fallback)
    if photo is None:
        bpy.ops.mesh.primitive_plane_add(size=1, location=pos)
        photo      = bpy.context.object
        photo.name = obj_name
    photo.location       = Vector(pos)
    photo.rotation_euler = (math.radians(90), 0, 0)
    photo.scale          = Vector(PHOTO_SCALE)
    clear_anim(photo)


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 3 — INDIA REVEAL
# Centred at (0, 108, 8). Invisible → scale-in → hold → drift → scale-out.
# ═══════════════════════════════════════════════════════════════════════════════

india = get_obj("INDIA CLEAN REVEAL", "INDIA REVEAL", "INDIA — KEYED")
if india:
    clear_anim(india)
    india.location       = (0.0, 108.0, 8.0)
    india.rotation_euler = (math.radians(90), 0, math.radians(-12))

    india.scale = (0.001, 0.001, 0.001)
    kf(india, "scale", 1)
    kf(india, "scale", 289)

    india.scale = (0.001, 0.001, 0.001)
    kf(india, "scale", 290)

    india.scale          = (3.2, 2.2, 1.0)
    india.rotation_euler = (math.radians(90), 0, 0)
    kf(india, "scale",         310)
    kf(india, "rotation_euler", 310)

    kf(india, "scale",         355)
    kf(india, "rotation_euler", 355)

    india.location       = (0.0, 110.0, 8.0)
    india.scale          = (2.0, 1.4, 0.7)
    india.rotation_euler = (math.radians(90), math.radians(8), math.radians(12))
    kf(india, "location",       375)
    kf(india, "scale",          375)
    kf(india, "rotation_euler", 375)

    india.scale = (0.001, 0.001, 0.001)
    kf(india, "scale", 395)

    set_interpolation(india, "scale",          "BEZIER")
    set_interpolation(india, "location",       "BEZIER")
    set_interpolation(india, "rotation_euler", "BEZIER")


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 4 — FINAL WIRE GLOBE
# Appears after India exits (frame 395+). Eases in over 30 frames.
# ═══════════════════════════════════════════════════════════════════════════════

globe_root = get_obj("V8 BROADCAST GLOBE ROOT")
if globe_root:
    clear_anim(globe_root)
    globe_root.location = (0.0, 115.0, 8.2)

    globe_root.scale = (0.001, 0.001, 0.001)
    kf(globe_root, "scale", 1)
    kf(globe_root, "scale", 394)

    globe_root.scale = (0.001, 0.001, 0.001)
    kf(globe_root, "scale", 395)

    globe_root.scale = (1.0, 1.0, 1.0)
    kf(globe_root, "scale", 425)

    kf(globe_root, "scale", 570)
    set_interpolation(globe_root, "scale", "BEZIER")


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 5 — LOGO (Material + Animation)
# ═══════════════════════════════════════════════════════════════════════════════

logo = get_obj("FINAL 3D JANTA LOGO", "JANTA KI AWAAZ LOGO")
if logo:

    # ── BLENDER 5.2 FIX B+D — Logo material ────────────────────────────────
    if LOGO_PATH.exists():
        img      = bpy.data.images.load(str(LOGO_PATH), check_existing=True)
        mat_name = "V11 LOGO EMISSION"
        mat      = bpy.data.materials.get(mat_name) or \
                   bpy.data.materials.new(mat_name)
        mat.use_nodes = True

        # FIX B: blend_method is REMOVED in Blender 4.2+.
        # FIX D: surface_render_method='BLENDED' is the correct 5.2 replacement.
        #        We try both; whichever exists on this build will succeed.
        try:
            mat.surface_render_method = 'BLENDED'   # Blender 4.2+ / 5.x
        except AttributeError:
            pass
        try:
            mat.blend_method = 'BLEND'              # Blender < 4.2 fallback
        except AttributeError:
            pass

        nodes = mat.node_tree.nodes
        links = mat.node_tree.links
        nodes.clear()

        out      = nodes.new("ShaderNodeOutputMaterial")
        mix      = nodes.new("ShaderNodeMixShader")
        transp   = nodes.new("ShaderNodeBsdfTransparent")
        emission = nodes.new("ShaderNodeEmission")
        tex      = nodes.new("ShaderNodeTexImage")

        tex.image                                = img
        tex.interpolation                        = "Linear"
        emission.inputs["Strength"].default_value = 1.2

        links.new(tex.outputs["Color"],         emission.inputs["Color"])
        links.new(tex.outputs["Alpha"],         mix.inputs[0])
        links.new(transp.outputs["BSDF"],       mix.inputs[1])
        links.new(emission.outputs["Emission"], mix.inputs[2])
        links.new(mix.outputs["Shader"],        out.inputs["Surface"])

        logo.data.materials.clear()
        logo.data.materials.append(mat)

    # ── Logo animation ───────────────────────────────────────────────────────
    # Route: lower-right (8, 113, 6.5) → behind globe (0.5, 114.5, 8.0)
    #        → upper-left (-3.5, 113, 9.5)
    clear_anim(logo)
    logo.rotation_euler = (math.radians(90), 0, 0)

    logo.scale = (0.001, 0.001, 0.001)
    kf(logo, "scale", 1)
    kf(logo, "scale", 499)

    logo.location = (8.0, 113.0, 6.5)
    logo.scale    = (0.001, 0.001, 0.001)
    kf(logo, "location",       500)
    kf(logo, "scale",          500)
    kf(logo, "rotation_euler", 500)

    logo.location = (8.0, 113.0, 6.5)
    logo.scale    = (3.0, 1.0, 1.0)
    kf(logo, "location", 510)
    kf(logo, "scale",    510)

    logo.location = (0.5, 114.5, 8.0)
    logo.scale    = (3.0, 1.0, 1.0)
    kf(logo, "location", 530)
    kf(logo, "scale",    530)

    logo.location = (-3.5, 113.0, 9.5)
    logo.scale    = (3.0, 1.0, 1.0)
    kf(logo, "location", 555)
    kf(logo, "scale",    555)

    kf(logo, "location",       570)
    kf(logo, "scale",          570)
    kf(logo, "rotation_euler", 570)

    set_interpolation(logo, "location",       "BEZIER")
    set_interpolation(logo, "scale",          "BEZIER")
    set_interpolation(logo, "rotation_euler", "BEZIER")


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 6 — MICROPHONE
# Opposite side of globe from logo; appears after globe is fully in.
# ═══════════════════════════════════════════════════════════════════════════════

mic = get_obj("NEWS MICROPHONE", "JANTA MICROPHONE", "MIC PROP")
if mic:
    clear_anim(mic)
    mic.location       = (4.0, 115.0, 8.0)
    mic.rotation_euler = (0, 0, math.radians(-15))

    mic.scale = (0.001, 0.001, 0.001)
    kf(mic, "scale", 1)
    kf(mic, "scale", 430)

    mic.scale = (0.001, 0.001, 0.001)
    kf(mic, "scale", 431)
    mic.scale = (1.0, 1.0, 1.0)
    kf(mic, "scale", 450)

    kf(mic, "location", 450)
    kf(mic, "scale",    570)

    set_interpolation(mic, "scale",    "BEZIER")
    set_interpolation(mic, "location", "BEZIER")


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 7 — RENDER OUTPUT
# ═══════════════════════════════════════════════════════════════════════════════

# Blender 5.x: Video is selected through media_type, not
# image_settings.file_format = "FFMPEG".

scene.render.image_settings.media_type = 'VIDEO'

# Set output path
OUT_DIR.mkdir(parents=True, exist_ok=True)

_out_path = str(OUT_DIR / "JantaNews_V11_FIXED.mp4")
scene.render.filepath = _out_path

# Video container
scene.render.ffmpeg.format = 'MPEG4'

# Video codec
scene.render.ffmpeg.codec = 'H264'

# Quality
scene.render.ffmpeg.constant_rate_factor = 'HIGH'

print(f"Output: MP4 (H264) -> {_out_path}")































# # FIX:
# #   1. Use addon_utils.enable() to enable render_ffmpeg programmatically.
# #   2. Then set file_format = 'FFMPEG' inside a try/except.
# #   3. If FFmpeg is truly unavailable (rare edge case), fall back to
# #      'AVI_JPEG' which is always present with no addon dependency.
# # ═══════════════════════════════════════════════════════════════════════════════
# import addon_utils

# # Enable the FFmpeg output addon — safe to call even if already enabled.
# try:
#     addon_utils.enable("render_ffmpeg", default_set=True, persistent=True)
#     print("render_ffmpeg addon enabled.")
# except Exception as _ae:
#     print(f"Could not enable render_ffmpeg addon: {_ae}")

# # Now configure the output format.
# try:
#     scene.render.image_settings.file_format  = "FFMPEG"
#     scene.render.ffmpeg.format               = "MPEG4"
#     scene.render.ffmpeg.codec                = "H264"
#     scene.render.ffmpeg.constant_rate_factor = "HIGH"
#     scene.render.ffmpeg.ffmpeg_preset        = "GOOD"
#     _out_path = str(OUT_DIR / "JantaNews_V11_FIXED.mp4")
#     scene.render.filepath = _out_path
#     print(f"Output: MP4 (H264)  →  {_out_path}")
# except Exception as _fe:
#     # Fallback: AVI JPEG — zero addon dependencies, always works in Blender 5.x
#     print(f"FFmpeg unavailable ({_fe}). Falling back to AVI JPEG.")
#     scene.render.image_settings.file_format = "AVI_JPEG"
#     scene.render.image_settings.quality     = 95
#     _out_path = str(OUT_DIR / "JantaNews_V11_FIXED.avi")
#     scene.render.filepath = _out_path
#     print(f"Output: AVI JPEG  →  {_out_path}")
#     print("TIP: After rendering, convert to MP4 with:")
#     print('     ffmpeg -i JantaNews_V11_FIXED.avi -c:v libx264 -crf 18 output.mp4')


# ═══════════════════════════════════════════════════════════════════════════════
# SECTION 8 — SAVE .BLEND
# ═══════════════════════════════════════════════════════════════════════════════
scene.frame_set(1)
save_path = str(OUT_DIR / "JantaNews_V11_Fixed.blend")
bpy.ops.wm.save_as_mainfile(filepath=save_path)
print("=" * 64)
print("JANTA KI AWAAZ V11 (Blender 5.2 LTS) — SAVED:", save_path)
print(f"Frame range : 1 → {scene.frame_end}  ({scene.frame_end/30:.1f} s @ 30 fps)")
print("=" * 64)