#!/usr/bin/env python
# coding: latin-1
import random
import math

rooms = ['T01','T02','T05','T06','T07','T08','T09','T10','T11','T12','T13','T17','T18','T21','T22','T23','T24','T25','T27','T28','T29','T30','T31','T34','T37']
'''
    https://en.wikipedia.org/wiki/Block_Elements
    https://en.wikipedia.org/wiki/Geometric_Shapes
'''
# asset_tag_replacement = ['▏▎▍▌▋▌▍▎▏','▁▃▅▇▅▃▁','❒❑❍❑❒❍❒❑','┬┴┬┴┬┴┬┴', '❍〇❍〇❍〇❍', '‿︵‿︵‿︵‿', '◌◯◌◯◌◯◌', '▁▔▁▔▁▔▁']
# asset_tag_replacement = ['┬┴┬┴┬┴┬┴', '❍〇❍〇❍〇❍', '‿︵‿︵‿︵‿', '◌◯◌◯◌◯◌']
asset_tag_replacement = ['######']


class Graph_Chars(object):
    def __init__(self, style='vert_blocks'):
        self.character_sets = {
            'vert_blocks': {
                'filler': '▁',
                'first': '▄',
                'second': '▇'
            },
            'angles': {
                'filler': '─',
                'first': '┴',
                'second': '┬'
            },
            'quad_blocks': {
                'filler': '█',
                'first': '▙',
                'second': '▟'
            },
            'circles': {
                'filler': '─',
                'first': '▢',
                'second': '◯'
            }
        }
        self.set = self.character_sets.get(style, self.character_sets['vert_blocks'])

    def filler(self):
        return self.set['filler']

    def first(self):
        return self.set['first']

    def second(self):
        return self.set['second']

g_chars = Graph_Chars('angles')

def asset_graph(num):
    block = g_chars.second()
    blanks = [g_chars.filler()] * 7
    # pos = int(math.ceil(num/2.0))
    (pos, remaind) = str((num - 1)/2.0).split('.')
    if not remaind == '5':
        block = g_chars.first()
    # pos = int(math.ceil(num/2.0))
    blanks[int(pos)] = block
    return ''.join(blanks)
    

for room in rooms:
    for c_num in range(1, 15):
        # Print from the colleciton of random graphs.
        print '{},{}-{:0{width}},{}'.format(random.sample(asset_tag_replacement, 1)[0], room, c_num, 'Kent', width=2)
        # Print a graph char set.
        # print '{},{}-{:0{width}},{}'.format(asset_graph(c_num), room, c_num, 'Kent', width=2)

