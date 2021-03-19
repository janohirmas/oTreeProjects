from numpy import random

from otree.api import (
    models,
    widgets,
    BaseConstants,
    BaseSubsession,
    BaseGroup,
    BasePlayer,
    Currency as c,
    currency_range,
)
import pandas as pd

author = 'Alejandro Hirmas'

doc = """
This app creates a Visual-Tracing table of content based on the users specifications. 
"""


class Constants(BaseConstants):
    name_in_url         = 'VisualTraceTable'
    players_per_group   = None
    num_rounds          = 10
    num_prounds         = 3
    sActivation         = 'click' # mouseover or click
    vTrigger            = ["Values"] # List that can include Columns,Rows and/or Values
    Attr_order          = "random" # random or constant
    nRows               = 3
    nCols               = 2
    vColnames           = ["Product A","Product B"]
    vRownames           = ["Price","Quality","Sustainability"]
    minPrice            = 12
    maxPrice            = 20
    stepPrice           = 2
    iLabelRange         = 5
    iAttr               = 3
    vSetPrice           = list(range(minPrice, maxPrice, stepPrice))
    vSetQuality         = list(range(1, iLabelRange, 1))
    vSetEco             = list(range(1, iLabelRange, 1))
    dConvPrice          = 0.5
    dConvQ              = 1
    dConvEco            = 1
    
    Cond_dic = {
        'iCondNumber': [],
        'iPrice': [],
        'iQ': [],
        'iEco': [],
        'sOrder': [],
    }

    # Set all conditions
    count = 1
    for p in vSetPrice:
        for q in vSetQuality:
            for e in vSetEco:
                Cond_dic['iCondNumber'].append(count)
                Cond_dic['iPrice'].append(p)
                Cond_dic['iQ'].append(q)
                Cond_dic['iEco'].append(e)
                count +=1
    dbCond = pd.DataFrame(Cond_dic)
    


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    ### Outcome variables ###
    iDec    = models.IntegerField()
    dRT     = models.FloatField()
    sPress  = models.StringField()

    ### Input variables ###
    iCondNumber = models.IntegerField()
    iRows       = models.IntegerField()
    iCols       = models.IntegerField() 
    sValues     = models.FloatField()  # Values separated by commas
    sColNames   = models.StringField() # Column Names separated by commas
    sRowNames   = models.StringField() # Row Names separated by commas
    dPrice      = models.FloatField()
    iQ          = models.IntegerField()
    iEco        = models.IntegerField()

    ### Choose final trials payout
    def FinalPayoff(self):
        # Determine selected round
        trial = random.choice(list(range(Constants.num_rounds)))
        # Set the Self-value and Eco Value
        Outcome_self    = self.in_round(trial).iQ*Constants.dConvQ - self.in_round(trial).dPrice*Constants.dConvPrice
        Outcome_eco     = self.in_round(trial).iEco*Constants.dConvEco
        final_value     = [Outcome_self,Outcome_eco]
        return final_value

    ### Create the dictionary with Trial Variables ###
    ### This should be defined by the Experimenter ###
    def Cond_player(self):
        #samples from the conditions in a random order (fraction=1 takes the whole sample)
        dbCondShuffle       = Constants.dbCond.sample(frac=1) 
        row_number          = self.round_number -1
        self.iCondNumber    = dbCondShuffle[row_number, 'iCondNumber']
        self.iRows          = dbCondShuffle[row_number, 'iRows']
        self.iCols          = dbCondShuffle[row_number, 'iCols']
        self.sValues        = dbCondShuffle[row_number, 'sValues']
        self.sColNames      = dbCondShuffle[row_number, 'sColNames']
        self.sRowNames      = dbCondShuffle[row_number, 'sRowNames']
        self.dPrice         = dbCondShuffle[row_number, 'dPrice']
        self.iQ             = dbCondShuffle[row_number, 'iQ']
        self.iEco           = dbCondShuffle[row_number, 'iEco']




