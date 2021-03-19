from ._builtin import Page


class MyPage2(Page):
    form_model = 'player'
    form_fields = ['name', 'age']

class Results(Page):
    pass

page_sequence = [MyPage2, Results]
