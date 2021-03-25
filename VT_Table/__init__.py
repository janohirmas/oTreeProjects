from otree.api import *
from numpy import random
import numpy as np
import pandas as pd

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
    # Require FullScreen (Deploys popup when not) True/False
    sRequireFS          = True                             
    # mouseover or click 
    sActivation         = 'click'                             
    # List that can include val,col,row
    vTrigger            = "val"                                   
    # random or constant
    Attr_order          = "random"  
    # Checks if you require FullScreen
    ## if you want to record number of FS changes add integer form iFullscreenChange
    bRequireFS          = False                                   
    # Checks if focus changes to other pages
    ## if you want to record the number of times that focus is lost, add integer form iFocusLost
    ## if you want to record the total time that focus is lost, add float form dFocusLostT
    bCheckFocus         = True                               
    # set up padding between rows (top and bottom)
    TablePaddingV       = "5vh"                                   
    # set up padding between columns (left and right)
    TablePaddingH       = "5vh"                                   
    # Column Names
    vColnames           = ["Product A", "Product B"]              
    # Row Names
    vRownames           = ["Price","Quality","Sustainability"]    
    # 1 Info,Info 2 Info,Uninfo 3 Uninfo,Info 4 Uninfo,Uninfo
    iTreatment          = 1                                       
    


class Subsession(BaseSubsession):
    pass

        


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    iDec                = models.IntegerField(blank=True)
    sButtonClick        = models.StringField(blank=True)
    sTimeClick          = models.StringField(blank=True)
    sTableVals          = models.StringField(blank=True)
    iTreatment          = models.IntegerField(blank=True)
    sAttrOrder          = models.StringField(blank=True)
    iFocusLost          = models.IntegerField(blank=True)
    dFocusLostT         = models.FloatField(blank=True)
    iFullscreenChange   = models.IntegerField(blank=True)

# FUNCTIONS

def treatments_conds():
            # create the dictionary with the variables
            treatments_dic = {
                'ConditionNumber': [],
                'sPCond': [],
                'sQCond': [],
                'sECond': [],
                'iQTreat': [],
                'iETreat':[],
            }
            # Define possible conditions
            lPConditions    = ['EQ','SD','BD'] # Equal (EQ), Small Difference (SD), Big Difference (BD) 
            lQConditions    = ['EQ','DQ'] # Equal Quality (EQ),  Different Quality (DQ)
            lEConditions    = ['EE','DE'] # Equal Eco (EE), Different Eco (DE)

            # These variables are specific to our treatment method
            iQTreat             = True
            iETreat             = True
            iTreatment          = Constants.iTreatment
            if iTreatment == 2:
                iETreat = False
            elif iTreatment == 3:
                iQTreat = False
            elif iTreatment == 4:
                iETreat = False
                iQTreat = False

            count               = 1
            for p in lPConditions :
                for q in lQConditions :
                    for e in lEConditions :
                        treatments_dic['sPCond'].append(p)
                        treatments_dic['sQCond'].append(q)
                        treatments_dic['sECond'].append(e)
                        treatments_dic['ConditionNumber'].append(count)
                        treatments_dic['iQTreat'].append(iQTreat)
                        treatments_dic['iETreat'].append(iETreat)
                        count +=1 
            treatments_df   = pd.DataFrame(treatments_dic)
            return treatments_df

# PAGES
class Decision(Page):
    form_model = 'player'
    form_fields = [
        'iDec', 
        'sButtonClick', 
        'sTimeClick',
        'sAttrOrder',
        'iFocusLost',
        'dFocusLostT',
        'iFullscreenChange',
    ]

    @staticmethod
    def js_vars(player: Player):
        nCols               = len(Constants.vColnames)
        nRows               = len(Constants.vRownames)
        vP                  = np.random.randint(10,20,nCols)
        vQ                  = np.random.randint(1,5,nCols)
        vE                  = np.random.randint(1,3,nCols)
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
            'sRequireFS'        : Constants.sRequireFS,
            'vTrigger'          : Constants.vTrigger,
            'Attr_order'        : Constants.Attr_order,
            'TablePaddingV'     : Constants.TablePaddingV,
            'TablePaddingH'     : Constants.TablePaddingH,
            'vColnames'         : Constants.vColnames,
            'vRownames'         : vRowNames,
            'bRequireFS'        : Constants.bRequireFS,
            'bCheckFocus'       : Constants.bCheckFocus,

        }
        



page_sequence = [Decision]
