from otree.api import Currency as c, currency_range
from ._builtin import Page, WaitPage
from .models import Constants


# ---------------------------------------------------------------------------------------------------------------------
class Part_1(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class Part_1_1(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class Part_1_2(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class ControlQuestionsDyadGuess(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class AfterFirstTask(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class Part_1a(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class Part_1_1a(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class Part_1_2a(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'


class ControlQuestionsIndGuess(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'D2'

# ---------------------------------------------------------------------------------------------------------------------


# ---------------------------------------------------------------------------------------------------------------------
class Decision_D2_Dyad(Page):
    """This page is only for A
     A submits his die roll and sends it to B and C3"""

    form_model = 'group'
    form_fields = ['belief_1_AB', 'belief_2_AB', 'belief_3_AB', 'belief_4_AB', 'belief_5_AB', 'belief_6_AB']

    def is_displayed(self):
        return self.player.role() == 'D2'



class Decision_D2_Ind(Page):
    """This page is only for A
     A submits his die roll and sends it to B and C3"""

    form_model = 'group'
    form_fields = ['belief_1_C1', 'belief_2_C1', 'belief_3_C1', 'belief_4_C1', 'belief_5_C1', 'belief_6_C1']

    def is_displayed(self):
        return self.player.role() == 'D2'



class ResultsWaitPage(WaitPage):
    # after_all_players_arrive = 'set_payoffs'
    pass



class Results(Page):
    """This page displays the earnings of each player"""
    pass



# ---------------------------------------------------------------------------------------------------------------------



page_sequence = [Part_1,
                 Part_1_1,
                 Part_1_2,
                 ControlQuestionsDyadGuess,
                 Decision_D2_Dyad,
                 AfterFirstTask,
                 Part_1_1a,
                 Part_1_2a,
                 ControlQuestionsIndGuess,
                 Decision_D2_Ind,
                 ResultsWaitPage,
                 Results]
