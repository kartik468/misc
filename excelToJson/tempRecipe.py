#!/usr/bin/env python2
# vim:fileencoding=utf-8
from __future__ import unicode_literals, division, absolute_import, print_function
from calibre.web.feeds.news import BasicNewsRecipe

class AdvancedUserRecipe1451024132(BasicNewsRecipe):
    title          = 'Finance wisdom'
    oldest_article = 1
    max_articles_per_feed = 100
    auto_cleanup   = True
    no_stylesheets        = True
    extra_css = '''
        p, div { margin: 0pt; border: 0pt; text-indent: 1.5em },
        spacious { margin-bottom: 1em; text-indent: 0pt; }
        '''

    feeds          = [
        ('Moolanomy', 'http://feeds2.feedburner.com/moolanomy'),
        ('Financial Samurai: T', 'http://feeds.feedburner.com/FinancialSamurai'),
        ('Zero Hedge', 'http://feeds.feedburner.com/zerohedge/feed'),
        ('Mish\u2019s Global Economic Trend Analysis', 'http://feeds2.feedburner.com/MishsGlobalEconomicTrendAnalysis'),
        ('Footnoted:', 'http://feeds.feedburner.com/Footnotedorg'),
        ('Infectious Greed', 'http://feeds.feedburner.com/InfectiousGreed'),
        ('Angry Bear:', 'http://angrybear.blogspot.com/feeds/posts/default'),
        ('Think Big', 'http://www.bespokeinvest.com/thinkbig/rss.xml'),
        ('The Big Picture', 'http://feeds.feedburner.com/TheBigPicture'),
        ('Money Under 30', 'http://feeds.feedburner.com/moneyunder30/gMhx'),
        ('20somethingfinance', 'http://feeds.feedburner.com/20somethingfinancecom'),
        ('20sMoney', 'http://feeds.feedburner.com/20sMoney'),
        ('/GenerationXFinance', 'http://feeds2.feedburner.com/GenerationXFinance'),
        ('Poorer Than You:', 'http://feeds.feedburner.com/PoorerThanYou'),
        ('How I Save Money:', 'http://feeds2.feedburner.com/lulugal'),
    ]
    remove_tags = [
        dict(name='img')
    ]