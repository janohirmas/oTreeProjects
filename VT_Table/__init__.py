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
    num_rounds          = 10                                      # Number of rounds
    num_prounds         = 3                                       # Number of Practice Rounds
    sActivation         = 'mouseover'                             # mouseover or click 
    vTrigger            = "row"                               # List that can include val,col,row
    Attr_order          = "random"                                # random or constant
    TablePaddingV        = "5vh"                                  # set up padding between rows (top and bottom)
    TablePaddingH        = "5vh"                                  # set up padding between columns (left and right)
    vColnames           = ["Product A", "Product B"]              # Column Names
    vRownames           = ["Price","Quality","Sustainability"]  # Row Names
    iTreatment          = 1                                       # 1 Info,Info 2 Info,Uninfo 3 Uninfo,Info 4 Uninfo,Uninfo


class Subsession(BaseSubsession):
    pass

        


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    iDec            = models.IntegerField(blank=True)
    sButtonClick    = models.StringField(blank=True)
    sTimeClick      = models.StringField(blank=True)
    sTableVals      = models.StringField(blank=True)
    iTreatment      = models.IntegerField(blank=True)
    sAttrOrder      = models.StringField(blank=True)

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
            'vTrigger'          : Constants.vTrigger,
            'Attr_order'        : Constants.Attr_order,
            'TablePaddingV'     : Constants.TablePaddingV,
            'TablePaddingH'     : Constants.TablePaddingH,
            'vColnames'         : Constants.vColnames,
            'vRownames'         : vRowNames,
        }
        



page_sequence = [Decision]
