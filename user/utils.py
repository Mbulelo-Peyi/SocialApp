from ipware.ip import get_client_ip
from django.contrib.gis.geoip2 import GeoIP2
from django_user_agents.utils import get_user_agent
from user.models import MembershipRequest, Community
from django.contrib.contenttypes.models import ContentType

def get_client_ip(request):
    
    try:
        ip_address, _ = get_client_ip(request)
    except:
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip_address = x_forwarded_for.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
    return ip_address

def get_info(request):
    geo = GeoIP2()
    user_agent = get_user_agent(request)
    try:
        ip_address = get_client_ip(request)
        country = geo.country_code(ip_address)
        city = geo.city(ip_address)
        system=user_agent.os.family
        device=user_agent.device.family
        browser=user_agent.browser.family[:30]
        browser_version=user_agent.browser.version_string
    except:
        ip_address = ''
        country = ''
        city = ''
        system= ''
        device= ''
        browser= ''
        browser_version= ''

    return (ip_address,country,city,system,device,browser,browser_version)

def get_community_requests(request,community:Community):
    user = request.user
    sender = ContentType.objects.get_for_model(user)
    community_requests = MembershipRequest.objects.filter(sender_content_type=sender, community=community)
    return community_requests

def get_user_community_requests(request):
    user = request.user
    sender = ContentType.objects.get_for_model(Community)
    community_requests = MembershipRequest.objects.filter(user=user,sender_content_type=sender)
    return community_requests

def get_user_sent_community_requests(request):
    user = request.user
    sender = ContentType.objects.get_for_model(user)
    community_requests = MembershipRequest.objects.filter(user=user,sender_content_type=sender)
    return community_requests
