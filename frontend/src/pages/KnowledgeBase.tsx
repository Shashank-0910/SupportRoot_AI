import { useEffect, useState } from 'react';
import {
  Upload,
  FileText,
  Globe,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  File,
  X,
  Loader2,
} from 'lucide-react';
import { supportApi, type KnowledgeArticle } from '../api/support';

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await supportApi.listArticles();
      setDocuments(data);
    } catch {
      setError('Failed to load knowledge base. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredDocs = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateText = async () => {
    if (!title.trim() || !content.trim()) return;
    setUploading(true);
    try {
      const article = await supportApi.createArticle({
        title: title.trim(),
        content: content.trim(),
        source_type: 'text',
        status: 'processed',
      });
      setDocuments((prev) => [article, ...prev]);
      setShowTextModal(false);
      setTitle('');
      setContent('');
    } catch {
      setError('Could not save article.');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadDemo = async () => {
    setUploading(true);
    try {
      const article = await supportApi.createArticle({
        title: title.trim() || 'New Document.pdf',
        content:
          content.trim() ||
          'Demo uploaded document content about refunds, shipping, and support policies for customer questions.',
        source_type: 'pdf',
        size_label: '1.2 MB',
        pages: 6,
      });
      setDocuments((prev) => [article, ...prev]);
      setShowUploadModal(false);
      setTitle('');
      setContent('');
    } catch {
      setError('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleAddWebsite = async () => {
    if (!websiteUrl.trim()) return;
    setUploading(true);
    try {
      let hostname = websiteUrl.trim();
      try {
        hostname = new URL(
          websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`
        ).hostname;
      } catch {
        /* keep raw */
      }
      const article = await supportApi.createArticle({
        title: hostname,
        content: `Website content crawled from ${websiteUrl}. Support hours, contact channels, and product FAQs.`,
        source_type: 'website',
        source_url: websiteUrl,
        size_label: 'pages',
      });
      setDocuments((prev) => [article, ...prev]);
      setShowUrlModal(false);
      setWebsiteUrl('');
    } catch {
      setError('Could not add website.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await supportApi.deleteArticle(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError('Delete failed.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary-400 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-surface-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-400" />;
      case 'website':
        return <Globe className="w-5 h-5 text-blue-400" />;
      default:
        return <File className="w-5 h-5 text-surface-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-surface-400 text-sm">
            Your AI learns from your business information to answer customer queries.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setShowTextModal(true)} className="btn btn-secondary btn-sm">
            <FileText className="w-4 h-4" />
            Add Article
          </button>
          <button onClick={() => setShowUrlModal(true)} className="btn btn-secondary btn-sm">
            <Globe className="w-4 h-4" />
            Add Website
          </button>
          <button onClick={() => setShowUploadModal(true)} className="btn btn-primary btn-sm">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{documents.length}</p>
              <p className="text-xs text-surface-500">Total Documents</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {documents.filter((d) => d.status === 'processed').length}
              </p>
              <p className="text-xs text-surface-500">Processed</p>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {documents.filter((d) => d.status === 'processing').length}
              </p>
              <p className="text-xs text-surface-500">Processing</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-with-icon"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-surface-400 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading knowledge base...
        </div>
      ) : (
        <div className="space-y-2">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 rounded-xl glass glass-hover transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                {getTypeIcon(doc.source_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{doc.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-surface-500">{doc.size_label || '—'}</span>
                  {doc.pages != null && (
                    <span className="text-xs text-surface-500">{doc.pages} pages</span>
                  )}
                  <span className="text-xs text-surface-500">{relativeTime(doc.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusIcon(doc.status)}
                <span
                  className={`text-xs font-medium capitalize ${
                    doc.status === 'processed'
                      ? 'text-emerald-400'
                      : doc.status === 'processing'
                        ? 'text-primary-400'
                        : 'text-red-400'
                  }`}
                >
                  {doc.status}
                </span>
              </div>
              <button
                onClick={() => handleDelete(doc.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-surface-500 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {filteredDocs.length === 0 && (
            <div className="text-center py-16 text-surface-500 text-sm">
              No documents yet. Add an article to power the AI assistant.
            </div>
          )}
        </div>
      )}

      {showTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-850 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add Text Article</h3>
              <button
                onClick={() => setShowTextModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-surface-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Return Policy"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-2">Content</label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste policy or FAQ text the AI should learn from..."
                  className="input resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowTextModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleCreateText}
                disabled={uploading || !title.trim() || !content.trim()}
                className="btn btn-primary btn-sm"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-850 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-surface-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-surface-500 mb-4">
              Demo mode: enter a title and optional text (simulates PDF upload).
            </p>
            <div className="space-y-4">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document name (e.g. Product Guide.pdf)"
                className="input"
              />
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Optional extracted text..."
                className="input resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUploadModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button onClick={handleUploadDemo} disabled={uploading} className="btn btn-primary btn-sm">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {showUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface-850 border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add Website</h3>
              <button
                onClick={() => setShowUrlModal(false)}
                className="p-1 rounded-lg hover:bg-white/5 text-surface-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">Website URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="input input-with-icon"
                />
              </div>
              <p className="text-xs text-surface-500 mt-2">
                Demo mode: we store the URL and placeholder crawl content for the AI.
              </p>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowUrlModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button
                onClick={handleAddWebsite}
                disabled={uploading || !websiteUrl.trim()}
                className="btn btn-primary btn-sm"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add Website
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
