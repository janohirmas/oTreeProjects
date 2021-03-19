from otree.api import Currency as c, currency_range
from ._builtin import Page, WaitPage
from .models import Constants


class Instructions2(Page):
    def is_displayed(self):
        return (self.round_number == Constants.num_practice_rounds + 1)

    # we do this ti transfer the variables from the game to questionnaire app in order to run the lottery
    def before_next_page(self):
        self.participant.vars['number_of_all_rounds'] = Constants.num_rounds
        self.participant.vars['number_of_practice_rounds'] = Constants.num_practice_rounds

class Attention(Page):
    def is_displayed(self):
        return (self.round_number == 1)
            
class Trial_and_decision(Page):
    form_model = 'player'
    form_fields = ['dec', 'RT', 'FN_gains', 'FN_losses', 'left', 'first', 'last_screen', 'last_fix_t']
    def vars_for_template(self):
        randomized_table = self.player.treatments_player()
        row_for_the_trial = randomized_table.iloc[self.player.row_number]
        return dict(
            FT_gain = row_for_the_trial['FT_gain'],
            FT_loss = row_for_the_trial['FT_loss'],
            Loss = row_for_the_trial['Loss'],
            Gain = row_for_the_trial['Gain']
        )
    def is_displayed(self):
        return self.round_number <= Constants.num_rounds #True
    # we do this to transfer the variables from the game to questionnaire app in order to run the lottery
    def before_next_page(self):
        self.participant.vars[str(self.round_number)] = [self.player.dec, self.player.Gain, self.player.Loss]
        # Compute time spent on gains and losses overal per trial
        t_gains = self.player.FT_gain * self.player.FN_gains
        t_losses = self.player.FT_loss * self.player.FN_losses
        # adjust the last fixation time
        if self.player.dec != 0:
            if self.player.last_screen == 0: #loss
                t_losses = t_losses - self.player.FT_loss + self.player.last_fix_t
            elif self.player.last_screen == 1: #gain
                t_gains = t_gains - self.player.FT_gain + self.player.last_fix_t
        self.player.t_gains = t_gains
        self.player.t_losses = t_losses
class Feedback(Page):
    def vars_for_template(self):
        return dict(
            dec = self.player.dec,
        )
    def is_displayed(self):
        return self.round_number <= Constants.num_rounds #True

class Confidence(Page):
    form_model = 'player'
    form_fields = ['conf', 'conf_RT']
    def is_displayed(self):
        dec_X = self.player.dec
        return (dec_X != 0) and (self.round_number <= Constants.num_rounds) #True

class ResultsWaitPage(WaitPage):
    pass

class Middle_page(Page):
    def is_displayed(self):
        return (self.round_number == Constants.num_practice_rounds + (Constants.num_trial_rounds//2))

page_sequence = [Instructions2, Attention, Trial_and_decision, Feedback, Confidence, Middle_page]
