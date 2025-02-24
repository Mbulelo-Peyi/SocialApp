from rest_framework import pagination

class CommentReplyPagination(pagination.PageNumberPagination):
    page_size = 5  # Default page size
    page_size_query_param = 'page_size'
    max_page_size = 10  # Limit maximum objects fetched

class CommentPagination(pagination.PageNumberPagination):
    page_size = 10  # Default page size
    page_size_query_param = 'page_size'
    max_page_size = 50  # Limit maximum objects fetched