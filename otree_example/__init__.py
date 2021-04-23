from otree.api import *
import numpy as np
from numpy import random
from random import sample
from random import choices
import pandas as pd
import csv
import copy

doc = """
Example of an Experiment for oTree tutorial
"""


class Constants(BaseConstants):
    name_in_url         = 'otree_example'
    players_per_group   = None
    num_rounds          = 3
    vColors                 = ['red','blue','green','black']


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    iDec1               = models.IntegerField(blank=True)
    iDec2               = models.IntegerField(blank=True)
    iDec3               = models.BooleanField(blank=True)
    dRT1                = models.FloatField(blank=True)
    sButtonClick        = models.StringField(blank=True)
    sTimeClick          = models.StringField(blank=True)
    sVal1               = models.StringField(blank=True)
    sVal2               = models.StringField(blank=True)
    sVal3               = models.StringField(blank=True)
    sTreat1             = models.StringField(blank=True)
    sTreat2             = models.StringField(blank=True)
    sTreat3             = models.StringField(blank=True)
    sColors             = models.StringField(blank=True)
    iImg                = models.IntegerField(blank=True)

# FUNCTIONS

def creating_session(subsession):
    # randomize to treatments
    for player in subsession.get_players():
        # Setup a treatment condition (changes each round)
        player.sTreat3          = random.choice(['Like', 'Dislike'])
        print('set player.sTreat3 to', player.sTreat3)
        player.iImg             = random.randint(low=1,high=3) 
        print('set player.iImg to', player.iImg)
        # Setup a treatment condition (constant within player)
        participant             = player.participant
        ## This one remains constant across trials
        sTreat1          = random.choice(['easy', 'difficult'])
        player.sTreat1  = sTreat1
        print('set player.sTreat1 to', player.sTreat1)

        if (sTreat1=='easy'):
            values          = random.randint(low=1,high=10,size=2)
        elif (sTreat1=='difficult'):
            values          = random.randint(low=50,high=100,size=2)
        else: 
            print('Treatment1 selection did not work')
        player.sVal1    = ';'.join(map(str,values))
        print('sVal1 =',player.sVal1)

        ## This one changes per trial but is fixed once
        mTreat2                 = random.choice(['word', 'color'], size=Constants.num_rounds)
        vColors                 = Constants.vColors.copy()
        random.shuffle(vColors) 
        player.sVal2            = ';'.join(vColors)
        random.shuffle(vColors) 
        player.sColors          = ';'.join(vColors)
        iRound                  = player.round_number
        player.sTreat2          = mTreat2[iRound-1]
        print('set player.sTreat2 to', player.sTreat2)
        participant.mTreatment  = {
            'Treat1' : sTreat1,
            'Treat2' : mTreat2,
        }


# PAGES
class SumUp(Page):
    form_model = 'player'
    form_fields = [
        'iDec1',  
        'dRT1',
    ]
    @staticmethod
    def vars_for_template(player):
        participant     = player.participant
        values          = player.sVal1.split(';')
        iRound          = player.round_number
        return {
            'Value1'    : values[0],
            'Value2'    : values[1],
        }



class VisualTrace(Page):
    form_model = 'player'
    form_fields = [
        'iDec2',         
        'sButtonClick',
        'sTimeClick',
    ]

    @staticmethod
    def vars_for_template(player):
        participant     = player.participant
        values          = player.sVal2.split(';')
        iRound          = player.round_number
        return {
            'Color1'    : values[0],
            'Color2'    : values[1],
            'Color3'    : values[2],
            'Color4'    : values[3],
            'treatment' : player.sTreat2,
        }


class ImageLike(Page):
    form_model = 'player'
    form_fields = [
        'iDec3', 
    ]
    @staticmethod
    def vars_for_template(player):
        return {
            'Image'    :  "".join(['otree-example/meme', str(player.iImg) , '.jpg']) ,
        }

page_sequence = [SumUp,VisualTrace,ImageLike]
