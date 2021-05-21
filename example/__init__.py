from numpy.core.fromnumeric import partition
from otree.api import *
from numpy import random

c = Currency

doc = """
Your app description
"""


class Constants(BaseConstants):
    name_in_url = 'example'
    players_per_group = None
    num_rounds = 5


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    treatment = models.StringField(blank=True)

# functions
def creating_session(subsession):
    for player in subsession.get_players():
        participant = player.participant
        if (player.round_number==1):
                participant.iTreat = random.choice([1,3])
        player.treatment = participant.iTreat 

# PAGES
class MyPage(Page):

    @staticmethod
    def vars_for_template(player):
        participant     = player.participant
        print(player.treatment)
        # P1 = participant.treatment
        # P2 = player.treatment
        return {
            'P1'    : player.treatment,
            'P2'    : participant.iTreat,
        }


class ResultsWaitPage(WaitPage):
    pass


class Results(Page):
    pass


page_sequence = [MyPage]
