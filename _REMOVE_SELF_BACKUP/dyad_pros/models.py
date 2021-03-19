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
import random


author = 'Ivan the f**king great'

doc = """
To be dona
"""



class Constants(BaseConstants):
    name_in_url = 'dyad_pros'
    players_per_group = 4
    num_rounds = 4

    instructions_AB  = 'dyad_pros/instructions_AB.html'
    instructions_C3 = 'dyad_pros/instructions_C3.html'
    instructions_AB_1  = 'dyad_pros/instructions_AB_1.html'
    instructions_C3_1 = 'dyad_pros/instructions_C3_1.html'
    instructions_AB_2  = 'dyad_pros/instructions_AB_2.html'
    instructions_C3_2 = 'dyad_pros/instructions_C3_2.html'
    instructions_C3_3 = 'dyad_pros/instructions_C3_3.html'
    instructions_C3_4 = 'dyad_pros/instructions_C3_4.html'
    instructions_C3_5 = 'dyad_pros/instructions_C3_5.html'



class Subsession(BaseSubsession):

    def creating_session(self):
        if self.round_number == 1:
            for g in self.get_groups():
                p1 = g.get_player_by_id(1)
                p1.participant.vars['paid_period'] = random.randint(1, Constants.num_rounds)
                print(p1.participant.vars)



class Group(BaseGroup):
    report_A  = models.IntegerField(min=1, max=6, label="Report the number you rolled?")
    report_B  = models.IntegerField(min=1, max=6, label="Report the number you rolled?")
    report_C3 = models.IntegerField(min=1, max=6, label="Report the number you rolled?")

    def set_payoffs_AB(self):
        pA = self.get_player_by_role('A')
        pB = self.get_player_by_role('B')

        if self.report_A == self.report_B:
            pA.payoff = c(self.report_A)
            pB.payoff = c(self.report_B)
        else:
            pA.payoff = c(0)
            pB.payoff = c(0)

        if self.round_number != pA.participant.vars['paid_period']:
            pA.participant.payoff  = pA.participant.payoff  - pA.payoff
            pB.participant.payoff  = pB.participant.payoff  - pA.payoff

    def set_payoffs_CD(self):
        pA = self.get_player_by_role('A')
        pC3 = self.get_player_by_role('C3')
        pD2 = self.get_player_by_role('D2')

        if self.report_A == self.report_C3:
            pC3.payoff = c(self.report_C3)
            pD2.payoff = c(self.report_C3)
        else:
            pC3.payoff = c(0)
            pD2.payoff = c(0)

        if self.round_number != pA.participant.vars['paid_period']:
            pC3.participant.payoff = pC3.participant.payoff - pC3.payoff
            pD2.participant.payoff = pD2.participant.payoff - pD2.payoff


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


