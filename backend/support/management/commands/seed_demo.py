from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Workspace
from support.models import KnowledgeArticle, Ticket

User = get_user_model()

DEMO_ARTICLES = [
    {
        'title': 'Refund Policy',
        'source_type': 'pdf',
        'size_label': '2.4 MB',
        'pages': 12,
        'content': (
            'Customers can request a full refund within 30 days of purchase. '
            'To initiate a refund, visit your order history and click Request Refund. '
            'Refunds are typically processed within 5-7 business days and credited '
            'to the original payment method. Damaged products qualify for free '
            'replacement or full refund with photo evidence.'
        ),
    },
    {
        'title': 'Shipping & Delivery',
        'source_type': 'pdf',
        'size_label': '980 KB',
        'pages': 4,
        'content': (
            'Standard delivery takes 3-5 business days for domestic orders. '
            'Express delivery is available for 1-2 business day delivery at an '
            'additional charge. International orders typically take 7-14 business '
            'days depending on destination. Track orders in real-time from your account dashboard.'
        ),
    },
    {
        'title': 'Pricing Plans',
        'source_type': 'text',
        'size_label': '4 KB',
        'content': (
            'We offer three pricing tiers: Starter at $29/month (500 conversations), '
            'Professional at $79/month (5,000 conversations), and Enterprise at '
            '$199/month (unlimited). All plans include a 14-day free trial. '
            'Annual billing provides a 20% discount across all tiers.'
        ),
    },
    {
        'title': 'Payment Methods FAQ',
        'source_type': 'pdf',
        'size_label': '1.8 MB',
        'pages': 8,
        'content': (
            'We accept all major credit and debit cards (Visa, Mastercard, Amex), '
            'UPI, net banking, and popular wallets. If your payment failed but the '
            'amount was deducted, it will be automatically refunded within 48 hours. '
            'Contact billing if the issue persists.'
        ),
    },
    {
        'title': 'company.com Support Hub',
        'source_type': 'website',
        'size_label': '156 pages',
        'source_url': 'https://company.com',
        'content': (
            'Our support team is available 24/7 through live chat, email at '
            'support@company.com, or phone at 1-800-SUPPORT. For urgent issues, '
            'use live chat for the fastest response, typically under 2 minutes.'
        ),
    },
]

DEMO_TICKETS = [
    {
        'subject': 'Payment failed but amount deducted',
        'customer_name': 'Ananya Gupta',
        'customer_email': 'ananya@example.com',
        'priority': 'high',
        'status': 'open',
        'description': (
            'Customer reports that payment failed during checkout, but ₹2,499 '
            'was deducted. Transaction ID: TXN789456123.'
        ),
        'ai_analysis': (
            'Likely a payment gateway timeout. Payment may have been captured '
            'without a success callback. Verify with the gateway and confirm or refund.'
        ),
        'suggested_response': (
            'Hi Ananya, I have checked transaction TXN789456123. Your payment was '
            'captured and the order is now confirmed. You should receive a confirmation '
            'email shortly. Let us know if you need anything else!'
        ),
    },
    {
        'subject': 'Refund request for damaged product',
        'customer_name': 'Rahul Sharma',
        'customer_email': 'rahul@example.com',
        'priority': 'medium',
        'status': 'pending',
        'description': 'Product arrived damaged. Customer wants a full refund.',
        'ai_analysis': 'Matches Refund Policy: damaged goods qualify for refund with photo evidence.',
        'suggested_response': (
            'Hi Rahul, sorry about the damage. Please share photos of the product and '
            'packaging and we will process a full refund within 5-7 business days.'
        ),
    },
    {
        'subject': 'How to integrate with Slack',
        'customer_name': 'Rohan Desai',
        'customer_email': 'rohan@example.com',
        'priority': 'low',
        'status': 'resolved',
        'description': 'Customer asked about Slack integration steps.',
        'ai_analysis': 'Feature/integration question; resolved with docs link.',
        'suggested_response': 'Hi Rohan, Slack integration steps are in our docs under Integrations → Slack.',
    },
]


class Command(BaseCommand):
    help = 'Seed demo knowledge articles and tickets for the logged-in workspace (or create a demo user).'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            default='demo@supportroot.ai',
            help='User email whose workspace will receive seed data',
        )

    def handle(self, *args, **options):
        email = options['email']
        user = User.objects.filter(email=email).first()
        if not user:
            workspace = Workspace.objects.create(name='Demo Workspace')
            user = User.objects.create_user(
                email=email,
                username='demo',
                password='demo1234',
                first_name='Demo',
                last_name='User',
                workspace=workspace,
            )
            self.stdout.write(self.style.SUCCESS(f'Created demo user {email} / demo1234'))
        else:
            workspace = user.workspace
            if not workspace:
                workspace = Workspace.objects.create(name='Demo Workspace')
                user.workspace = workspace
                user.save(update_fields=['workspace'])

        created_articles = 0
        for item in DEMO_ARTICLES:
            _, was_created = KnowledgeArticle.objects.get_or_create(
                workspace=workspace,
                title=item['title'],
                defaults={
                    'content': item['content'],
                    'source_type': item['source_type'],
                    'status': 'processed',
                    'size_label': item.get('size_label', ''),
                    'pages': item.get('pages'),
                    'source_url': item.get('source_url', ''),
                },
            )
            if was_created:
                created_articles += 1

        created_tickets = 0
        for item in DEMO_TICKETS:
            exists = Ticket.objects.filter(
                workspace=workspace, subject=item['subject']
            ).exists()
            if not exists:
                Ticket.objects.create(
                    workspace=workspace,
                    created_by=user,
                    assigned_to=user.first_name or 'Demo',
                    **item,
                )
                created_tickets += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeded workspace "{workspace.name}": '
                f'+{created_articles} articles, +{created_tickets} tickets'
            )
        )
