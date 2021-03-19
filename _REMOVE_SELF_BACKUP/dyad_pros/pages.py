from otree.api import Currency as c, currency_range
from ._builtin import Page, WaitPage
from .models import Constants


# ---------------------------------------------------------------------------------------------------------------------
class Introduction(Page):

    def is_displayed(self):
        return self.round_number == 1


class Part_1(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() != 'D2'


class Part_1_1(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() != 'D2'


class Part_1_2(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() != 'D2'


class Part_1_3(Page):  # only C3 sees this page

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'C3'


class Part_1_4(Page):  # only C3 sees this page

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'C3'


class Part_1_5(Page):  # only C3 sees this page

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() == 'C3'


class How_to_roll(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() != 'D2'


class ControlQuestions(Page):

    def is_displayed(self):
        return self.round_number == 1 and self.player.role() != 'D2'
# ---------------------------------------------------------------------------------------------------------------------


# ---------------------------------------------------------------------------------------------------------------------
class WaitAfterCQ(WaitPage):

    def is_displayed(self):
        return self.player.role() != 'D2'


class Decision_A(Page):
    """This page is only for A
     A submits his die roll and sends it to B and C3"""

    form_model = 'group'
    form_fields = ['report_A']

    def is_displayed(self):
        return self.player.role() == 'A'


class Wait_for_A(WaitPage):

    def is_displayed(self):
        return self.player.role() != 'D2'


class Decision_B(Page):
    """This page is only for B
    B submits his die roll and it is sent back to A"""

    form_model = 'group'
    form_fields = ['report_B']

    def is_displayed(self):
        return self.player.role() == 'B'

    def before_next_page(self):
        self.group.set_payoffs_AB()


class Decision_C(Page):
    """This page is only for C
    C submits his die roll"""

    form_model = 'group'
    form_fields = ['report_C3']

    def is_displayed(self):
        return self.player.role() == 'C3'

    def before_next_page(self):
        self.group.set_payoffs_CD()


class ResultsWaitPage(WaitPage):
    # after_all_players_arrive = 'set_payoffs'

    def is_displayed(self):
        return self.player.role() != 'D2'


class Results(Page):
    """This page displays the earnings of each player"""

    def is_displayed(self):
        return self.player.role() != 'D2'


# ---------------------------------------------------------------------------------------------------------------------


page_sequence = [Introduction,
                 Part_1,
                 Part_1_1,
                 Part_1_2,
                 Part_1_3,
                 Part_1_4,
                 Part_1_5,
                 How_to_roll,
                 ControlQuestions,
                 WaitAfterCQ,
                 Decision_A,
                 Wait_for_A,
                 Decision_B,
                 Decision_C,
                 ResultsWaitPage,
                 Results]
