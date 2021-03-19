from numpy import random
from otree.api import (
    models,
    widgets,
    BaseConstants,
    BaseSubsession,
    BaseGroup,
    BasePlayer,
)
import pandas as pd
import random

author = 'Evgeny Vasilets'

doc = """
This is the experiment investigating the nature of loss-aversion.
"""


class Constants(BaseConstants):
    name_in_url = 'game'
    players_per_group = None
    num_trial_rounds = 44
    num_practice_rounds = 3
    num_rounds = num_trial_rounds + num_practice_rounds


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    # Condition numbers: 1 - equal, 2 - gains are longer, 3 - gains are super longer, 4 - losses are longer, 5 - losses are super longer
    cond_num = models.IntegerField()
    # number of a trial in a non-randomised data-frame
    original_trial_num = models.IntegerField()
    # 1 = accepted, 2 = rejected, 0 = no decision was made
    dec = models.IntegerField(blank=True)
    # values in ECU
    Loss = models.IntegerField()
    Gain = models.IntegerField()
    # binary: 0 - real trials, 1 - training trials
    practice_trial = models.IntegerField()
    row_number = models.IntegerField()
    # time per decision in ms
    RT = models.IntegerField()
    # write down gains and loss conditions ( 1 = high or 0 = low)
    gain_cond = models.IntegerField()
    loss_cond = models.IntegerField()
    # Fixation time for losses and gains
    FT_gain = models.IntegerField()
    FT_loss = models.IntegerField()
    # record the number of fixations for losses and gains
    FN_gains = models.IntegerField(blank=True)
    FN_losses = models.IntegerField(blank=True)
    # each condition is repeated 2 times, so the rep variable tracks this
    rep = models.IntegerField()

    # duration of the last fixation
    last_fix_t = models.IntegerField(blank=True)

    # 0 - left was loss, 1 - left was gain
    left = models.IntegerField()
    # 0 - first was loss, 1 - first was gain
    first = models.IntegerField()
    # 0 - last was loss, 1 - last was gain
    last_screen = models.IntegerField(blank=True)
    # time actually spent by participants on gains and losses per trial
    t_gains = models.IntegerField()
    t_losses = models.IntegerField()


    conf = models.IntegerField(blank=True)
    # RT in ms
    conf_RT = models.IntegerField(blank=True)



    def treatments_player(self):
        # create the dictionary with the variables
        treatments_dic = {
            'rep': [],
            'original_trial_num': [],
            'cond_num': [],
            'condition_name_X': [],
            'Loss': [],
            'Gain': [],
            'gain_cond':[],
            'loss_cond':[],
            'FT_loss': [],
            'FT_gain': [],
        }

        condition_names = ['losses_are_longer', 'losses_are_super_longer', 'equal', 'gains_are_longer', 'gains_are_super_longer']  # -1 - losses, 0 - equal, 1 - gains (used to be last_fix_longer)
        # Losses
        low_losses = list(range(-10, -20, -1))
        high_losses = list(range(-20, -30, -1))
        losses_lists = [high_losses, low_losses]
        # Gains
        low_gains = list(range(20, 30, 1))
        high_gains = list(range(30, 40, 1))
        gains_lists = [low_gains, high_gains]
        # Duration of long and short fixations (in ms)
        fixation_duration = 400
        fixation_duration_long = 600
        fixation_duration_super_long = 800
        # Counter of the rows in the treatment table
        count = 1
        # Create a dictionary with all conditions
        # Each condition will be repeated 2 times
        for repetition in range(2):
            for condition_name in condition_names:
                for losses in losses_lists:
                    for gains in gains_lists:
                        gain = random.choice(gains)
                        lose = random.choice(losses)
                        treatments_dic['original_trial_num'].append(count)
                        treatments_dic['condition_name_X'].append(condition_name)
                        treatments_dic['Loss'].append(lose)
                        treatments_dic['Gain'].append(gain)
                        treatments_dic['rep'].append(repetition)
                        # Define the value conditions
                        if gains == low_gains:
                            treatments_dic['gain_cond'].append(0)
                        elif gains == high_gains:
                            treatments_dic['gain_cond'].append(1)
                        if losses == high_losses:
                            treatments_dic['loss_cond'].append(1)
                        elif losses == low_losses:
                            treatments_dic['loss_cond'].append(0)
                        # Define fixation times for gains and losses in the trial
                        def fix_times_gains_and_losses(condition_name):
                            # The function returns 3 values: first one is gain, the second one is the loss fixation time and the third is the condition number
                            return {
                                'losses_are_longer': [fixation_duration, fixation_duration_long, 2],
                                'losses_are_super_longer': [fixation_duration, fixation_duration_super_long, 3],
                                'gains_are_longer': [fixation_duration_long, fixation_duration, 4],
                                'gains_are_super_longer': [fixation_duration_super_long, fixation_duration, 5],
                                'equal': [fixation_duration, fixation_duration, 1],
                            }[condition_name]
                        fixation_time_gain, fixation_time_loss, condition_number = fix_times_gains_and_losses(condition_name)
                        treatments_dic['FT_gain'].append(fixation_time_gain)
                        treatments_dic['FT_loss'].append(fixation_time_loss)
                        treatments_dic['cond_num'].append(condition_number)
                        count+= 1
        # add 2 more fixations (0, -30 and 0, 40)
        extra_fixations = [[-30, 0], [0, 40]]
        for repetition in range(2):
            for pair in extra_fixations:
                treatments_dic['original_trial_num'].append(count)
                treatments_dic['Loss'].append(pair[0])
                treatments_dic['Gain'].append(pair[1])
                treatments_dic['gain_cond'].append(0)
                treatments_dic['loss_cond'].append(0)
                treatments_dic['FT_loss'].append(400)
                treatments_dic['FT_gain'].append(400)
                treatments_dic['cond_num'].append(1)
                treatments_dic['rep'].append(repetition)
                treatments_dic['condition_name_X'].append('check')
                count += 1
        treatments_df = pd.DataFrame(treatments_dic)
        # randomize the table using a randomly generated number (which will be the same for all trials for a specific participant)
        randomized_mixed_repetitions = treatments_df.sample(frac=1, random_state=self.participant.vars['rand_int'])
        # make sure that first rep is shown on the first half and the second is on the second half
        randomized = randomized_mixed_repetitions.set_index('rep', drop=False).sort_index()
        # re-index the new table in order so we could present the new randomized table from start to the end
        randomized['new_indexing_X'] = list(range(0, len(randomized)))
        randomized = randomized.set_index(randomized['new_indexing_X'])
        # Check whether the trials are practice to decide whether to show random or
        # ordered rows from the randomized table
        pt = self.practice_trials()
        if pt == 0:
            row_number = self.round_number - 1 - Constants.num_practice_rounds
        elif pt == 1:
            # select random trials from trials with equal and not equal fixations
            if self.round_number % 2 == 0:
                appropriate_trials = randomized[randomized['cond_num'] == 1]
            else:
                appropriate_trials = randomized[randomized['cond_num'] != 1]
            row_number = int(appropriate_trials.sample().index[0])

        # write down the data for the participant for each row so we can see it during the data analysis
        self.original_trial_num = randomized.loc[row_number, 'original_trial_num']
        self.Loss = randomized.loc[row_number, 'Loss']
        self.Gain = randomized.loc[row_number, 'Gain']
        self.row_number = row_number
        self.gain_cond = randomized.loc[row_number, 'gain_cond']
        self.loss_cond = randomized.loc[row_number, 'loss_cond']
        self.FT_loss = randomized.loc[row_number, 'FT_loss']
        self.FT_gain = randomized.loc[row_number, 'FT_gain']
        self.cond_num = randomized.loc[row_number, 'cond_num']
        self.rep = randomized.loc[row_number, 'rep']
        return randomized
    def practice_trials(self):
        # this function defines whether these trials are training or test
        if self.round_number > Constants.num_practice_rounds:
            self.practice_trial = 0
            return 0
        else:
            self.practice_trial = 1
            return 1