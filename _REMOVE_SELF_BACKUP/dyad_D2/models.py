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


author = 'Ivan the f**king great'

doc = """
To be dona
"""


class Constants(BaseConstants):
    name_in_url = 'dyad_D2'
    players_per_group = 4
    num_rounds = 1

    instructions_D2    = 'dyad_D2/instructions_D2.html'
    instructions_D2_1  = 'dyad_D2/instructions_D2_1.html'
    instructions_D2_2  = 'dyad_D2/instructions_D2_2.html'
    instructions_D2_3  = 'dyad_D2/instructions_D2_3.html'
    instructions_D2_1a  = 'dyad_D2/instructions_D2_1a.html'
    instructions_D2_2a  = 'dyad_D2/instructions_D2_2a.html'
    instructions_D2_3a  = 'dyad_D2/instructions_D2_3a.html'

class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    #Belief of player D2
    belief_1_AB = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    #belief_2_AB = models.IntegerField(min=0, max=100, widget=widgets.Slider(attrs={'step': '1'}))
    belief_2_AB = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_3_AB = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_4_AB = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_5_AB = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_6_AB = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_1_C1 = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_2_C1 = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_3_C1 = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_4_C1 = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_5_C1 = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")
    belief_6_C1 = models.IntegerField(min=0, max=100, label="Report the likelihood in percentage")


class Player(BasePlayer):
    def role(self):
        if self.id_in_group == 1:
            return 'A'
        if self.id_in_group == 2:
            return 'B'
        if self.id_in_group == 3:
            return 'C3'
        if self.id_in_group == 4:
            return 'D2'


