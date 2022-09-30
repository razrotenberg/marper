interface Configuration {
    names: string[];
    description: string;
    formula: number[];
}

export class Rhythm {
    private names: string[];
    private description: string;
    private formula: number[];

    constructor(configuration: Configuration) {
        this.names = configuration.names;
        this.description = configuration.description;
        this.formula = configuration.formula;
    }

    static readonly Builtin: Rhythm[] = [
        // quarters
        { names: ['quarters', 'q', '4'],     description: '[*           ]', formula: [0/2    ] },
        { names: ['quarters offbeat', 'qo'], description: '[      *     ]', formula: [    1/2] },

        // eights
        { names: ['eighths', 'e', '8'],     description: '[*     *     ]', formula: [0/4,      2/4    ] },
        { names: ['eighths offbeat', 'eo'], description: '[   *     *  ]', formula: [     1/4,     3/4] },

        // sixteenths
        { names: ['sixteenths', 's', '16'], description: '[*  *  *  *  ]', formula: [0/4, 1/4, 2/4, 3/4] },
        { names: ['one e and', '1e+'],      description: '[*  *  *     ]', formula: [0/4, 1/4, 2/4     ] },
        { names: ['one and a', '1+a'],      description: '[*     *  *  ]', formula: [0/4,      2/4, 3/4] },
        { names: ['one e a', '1ea'],        description: '[*  *     *  ]', formula: [0/4, 1/4,      3/4] },
        { names: ['e and a', 'e+a'],        description: '[   *  *  *  ]', formula: [     1/4, 2/4, 3/4] },

        // triplets
        { names: ['triplets', 't', '8t'],    description: '[*   *   *   ]', formula: [0/6,      2/6,      4/6    ] },
        { names: ['triplets offbeat', 'to'], description: '[  *   *   * ]', formula: [     1/6,      3/6,     5/6] },
        { names: ['swung triplets', 'ts'],   description: '[*       *   ]', formula: [0/3,                2/3    ] },
        { names: ['swing', 'sw'],            description: '[*      (*)  ]', formula: [0/3, 3/3,           5/3    ] },

        // sextuplets
        { names: ['sextuplets', 'sx', '16t'], description: '[* * * * * * ]', formula: [0/6, 1/6, 2/6, 3/6, 4/6, 5/6] },
        { names: ['swung sextuplets', 'sxs'], description: '[*   * *   * ]', formula: [0/6,      2/6, 3/6,      5/6] },
    ].map(configuration => new Rhythm(configuration));

    static get(name: string): Rhythm | undefined {
        return Rhythm.Builtin.find(rhythm => rhythm.names.indexOf(name.toLowerCase()) > -1);
    }
}
