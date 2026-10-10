"""Simple keyword-overlap AI matcher against workspace knowledge articles."""

import re


def _tokens(text: str) -> set[str]:
    return {t for t in re.findall(r'[a-z0-9]+', text.lower()) if len(t) > 2}


def answer_from_knowledge(query: str, articles) -> dict:
    """
    Score KB articles by token overlap with the query.
    Returns answer, confidence (0-1), and matched article title if any.
    """
    query_tokens = _tokens(query)
    if not query_tokens:
        return {
            'answer': (
                "I couldn't understand that question. "
                'Please rephrase or create a ticket for a human agent.'
            ),
            'confidence': 0.2,
            'source': None,
        }

    best = None
    best_score = 0.0
    best_article = None

    for article in articles:
        haystack = f'{article.title} {article.content}'
        article_tokens = _tokens(haystack)
        if not article_tokens:
            continue
        overlap = query_tokens & article_tokens
        score = len(overlap) / len(query_tokens)
        # Prefer articles that cover more of the query
        if score > best_score:
            best_score = score
            best = article
            best_article = article

    if best is None or best_score < 0.15:
        return {
            'answer': (
                "Thank you for your question. I've searched through our knowledge base "
                "but couldn't find a confident answer. Let me connect you with a human "
                'support agent who can better assist you.'
            ),
            'confidence': 0.3,
            'source': None,
        }

    # Map overlap ratio to a demo-friendly confidence band
    confidence = min(0.98, 0.45 + best_score * 0.55)
    excerpt = best.content.strip()
    if len(excerpt) > 600:
        excerpt = excerpt[:600].rsplit(' ', 1)[0] + '...'

    answer = (
        f'Based on **{best.title}**, here is what I found:\n\n{excerpt}'
        if excerpt
        else f'I found a relevant document: {best.title}. Please review it for details.'
    )

    return {
        'answer': answer.replace('**', ''),
        'confidence': round(confidence, 2),
        'source': best_article.title if best_article else None,
    }
