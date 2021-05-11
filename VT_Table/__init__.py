from otree.api import *
import numpy as np
from numpy import random
from random import sample
from random import choices
import pandas as pd
import csv

doc = """
Creates Table with Visual Tracing
"""


class Constants(BaseConstants):
    name_in_url         = 'VT_Table'
    players_per_group   = None
    # Number of rounds
    num_rounds          = 10  
    # Number of Practice Rounds                                    
    num_prounds         = 3
    # mouseover or click 
    sActivation         = 'mouseover'                             
    # List that can include val,col,row
    vTrigger            = "val"                                   
    # random or constant
    Attr_order          = "random"  
    # Timeout time (in seconds)
    ## if no time-out required, leave as 0
    iTimeOut            = 0
    # Checks if you require FullScreen
    ## if you want to record number of FS changes add integer form iFullscreenChange
    bRequireFS          = True                                   
    # Checks if focus changes to other pages
    ## if you want to record the number of times that focus is lost, add integer form iFocusLost
    ## if you want to record the total time that focus is lost, add float form dFocusLostT
    bCheckFocus         = True                               
    # set up padding between rows (top and bottom)
    TablePaddingV       = "1vh"                                   
    # set up padding between columns (left and right)
    TablePaddingH       = "0vh"                                   
    # Column Names
    vColnames           = ["Product A", "Product B"]              
    # Row Names
    vRownames           = ["Price","Quality","Sustainability"] 
    # Image Path
    sImagePath          = 'EcoLabels/'   
    # 1 Info,Info 2 Info,Uninfo 3 Uninfo,Info 4 Uninfo,Uninfo
    iTreatment          = 1                                       
    


class Subsession(BaseSubsession):
    pass

class Group(BaseGroup):
    pass

class Player(BasePlayer):
    iDec                = models.IntegerField(blank=True)
    dRT                 = models.FloatField(blank=True)
    sButtonClick        = models.StringField(blank=True)
    sTimeClick          = models.StringField(blank=True)
    sTableVals          = models.StringField(blank=True)
    iTreatment          = models.IntegerField(blank=True)
    sAttrOrder          = models.StringField(blank=True)
    iFocusLost          = models.IntegerField(blank=True)
    dFocusLostT         = models.FloatField(blank=True)
    iFullscreenChange   = models.IntegerField(blank=True)


# FUNCTIONS

def creating_session(subsession):
    if subsession.round_number == 1:
        for player in subsession.get_players():
            participant = player.participant
            participant.mTreatment = random.choice(['blue', 'red'], size=Constants.num_rounds)


# PAGES
class Decision(Page):
    form_model = 'player'
    form_fields = [
        'iDec', 
        'sButtonClick', 
        'sTimeClick',
        'dRT',
        'sAttrOrder',
        'iFocusLost',
        'dFocusLostT',
        'iFullscreenChange',
    ]

    @staticmethod
    def vars_for_template(player):
        participant     = player.participant
        vTreatment      = participant.mTreatment
        iRound          = player.round_number
        return {
            'treatment' : vTreatment[iRound]
        }

    @staticmethod
    def js_vars(player: Player):
        nCols               = len(Constants.vColnames)
        nRows               = len(Constants.vRownames)
        lE                  = ['img:leaf_1.png','img:leaf_2.png','img:leaf_3.png']
        lQ                  = ['img:star_1.png','img:star_2.png','img:star_3.png']
        vP                  = random.randint(10,20,nCols)
        vQ                  = choices(lQ,k=nCols)
        vE                  = choices(lE,k=nCols)
        sP                  = ','.join(map(str,vP))
        sQ                  = ','.join(map(str,vQ))
        sE                  = ','.join(map(str,vE))
        lOutcomes           = [sP,sQ,sE]
         
        if Constants.Attr_order =='random':
            order               = list(range(nRows))
            random.shuffle(order)
            vOutcomes           = ','.join(map(str,[lOutcomes[i] for i in order]))
            vRowNames           = [Constants.vRownames[i] for i in order]
            player.sAttrOrder   = ','.join(map(str,order))
        else:
            order               = list(range(nRows))
            vOutcomes           = ','.join(map(str,lOutcomes))
            vRowNames           = Constants.vRownames
            player.sAttrOrder   = ''

        return {
            'vOutcomes'         : vOutcomes,
            'sActivation'       : Constants.sActivation,
            'vTrigger'          : Constants.vTrigger,
            'Attr_order'        : Constants.Attr_order,
            'TablePaddingV'     : Constants.TablePaddingV,
            'TablePaddingH'     : Constants.TablePaddingH,
            'vColnames'         : Constants.vColnames,
            'vRownames'         : vRowNames,
            'bRequireFS'        : Constants.bRequireFS,
            'bCheckFocus'       : Constants.bCheckFocus,
            'iTimeOut'          : Constants.iTimeOut,
            'sImagePath'        : Constants.sImagePath,
        }
        



page_sequence = [Decision]
