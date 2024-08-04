const {
    returnRandBase,
    mockUpStrand,
    pilaFactory,
    strong30,
    findMostRelated,
} = require('./script.js');

describe('returnRandBase()', () => {
    const bases = ['A', 'T', 'C', 'G'];
    const nonBases = ['E', 'S', 'B', 'H', 'Y', 'Z'];

    it('should return one of the valid bases: "A", "T", "C", or "G"', () => {
        const result = returnRandBase();
        expect(bases).toContain(result);
    });
    it('testing with other non-base letters', () => {
        const result = returnRandBase();
        expect(nonBases).not.toContain(result);
    });
});

describe('mockUpStrand()', () => {
    const valtestIdBases = ['A', 'T', 'C', 'G'];
    const result = mockUpStrand();

    it('should return an array with 15 elements', () => {
        expect(result).toHaveLength(15);
    });
    it('should contain only A, T, C, or G', () => {
        result.forEach((base) => expect(valtestIdBases).toContain(base));
    });
});

describe('pilaFactory()', () => {
    const strand = mockUpStrand();
    const testId = 1;
    let newPila;
    beforeEach(() => {
        newPila = pilaFactory(testId, strand);
    });

    it('should return an object', () => {
        expect(newPila).toBeInstanceOf(Object);
    });

    it('should return an object with testId and dna strand', () => {
        const sample = { specimenNum: testId, dna: strand };
        expect(newPila).toMatchObject(sample);
    });
});

describe('pilaFactory.mutate()', () => {
    let newPila;
    let originalDNA;
    let mutatedPila;

    beforeEach(() => {
        const testStrand = mockUpStrand();
        const testId = 1;
        newPila = pilaFactory(testId, testStrand);
        originalDNA = [...newPila.dna];
        mutatedPila = newPila.mutate();
    });

    it('should return a mutated dna with one random base different', () => {
        const differences = originalDNA.reduce(
            (count, base, index) =>
                base !== mutatedPila.dna[index] ? count + 1 : count,
            0,
        );
        expect(differences).toBe(1);
    });

    it('the rest of the strand is not changed', () => {
        const mutationIndex = originalDNA.findIndex(
            (base, index) => base !== mutatedPila.dna[index],
        );
        const restOfOrigStrand = originalDNA.filter(
            (base, index) => index !== mutationIndex,
        );
        const restOfMutStrand = mutatedPila.dna.filter(
            (base, index) => index !== mutationIndex,
        );
        expect(restOfOrigStrand).toEqual(restOfMutStrand);
    });

    test('mutate() returns the the entire object.', () => {
        expect(mutatedPila).toHaveProperty('specimenNum');
        expect(mutatedPila).toHaveProperty('dna');
        expect(mutatedPila).toHaveProperty('mutate');
        expect(typeof mutatedPila.mutate).toBe('function');
        expect(mutatedPila).toHaveProperty('compareDNA');
        expect(typeof mutatedPila.compareDNA).toBe('function');
    });
});

describe('compareDNA()', () => {
    let consoleSpy;
    const dnaStrand1 = mockUpStrand();
    const dnaStrand2 = mockUpStrand();
    const pila1 = pilaFactory(1, dnaStrand1);
    const pila2 = pilaFactory(2, dnaStrand1);
    const pila3 = pilaFactory(3, dnaStrand2);
    beforeEach(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should compare dna strans. Test should match 100%', () => {
        pila1.compareDNA(pila2);
        const expectedPercentage = 100.0;
        const expectedMessage = `Specimen #1 and Specimen #2 have ${expectedPercentage}% DNA in common.`;
        expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
    });
    it('should log a percentage of dna in common', () => {
        pila1.compareDNA(pila3);

        let match = 0;
        for (let i = 0; i < pila1.dna.length; i++) {
            if (pila1.dna[i] === pila3.dna[i]) {
                match++;
            }
        }
        const expectedPercentage = ((match / pila1.dna.length) * 100).toFixed(
            0,
        );
        const expectedMessage = `Specimen #1 and Specimen #3 have ${expectedPercentage}% DNA in common.`;
        expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
    });
});

describe('willLikelySurvive()', () => {
    const dnaStrand = mockUpStrand();
    const pila1 = pilaFactory(1, dnaStrand);

    it('is a method of a new pila', () => {
        expect(pila1).toHaveProperty('willLikelySurvive');
        expect(typeof pila1.willLikelySurvive).toBe('function');
    });
    it('returns a boolean', () => {
        const result = pila1.willLikelySurvive();
        expect(typeof result).toBe('boolean');
    });
    it('returns true if 60% or more of the strand is "C" or "G"', () => {
        const dnaStrand1 = [
            'C',
            'C',
            'G',
            'G',
            'C',
            'C',
            'G',
            'C',
            'G',
            'A',
            'T',
            'A',
            'T',
            'T',
            'A',
        ];
        const pila4 = pilaFactory(1, dnaStrand1);
        const result = pila4.willLikelySurvive();
        expect(result).toBe(true);
    });
    it('returns fails for a strand with no "C" or "G"', () => {
        const strand = new Array(15).fill('A');
        const pila5 = pilaFactory(5, strand);
        const result = pila5.willLikelySurvive();
        expect(result).toBe(false);
    });
});

describe('strong30()', () => {
    let result;

    beforeEach(() => {
        result = strong30();
    });
    it('returns an array', () => {
        expect(Array.isArray(result)).toBe(true);
    });
    it('returns an array with exactly 30 pila objects', () => {
        expect(result.length).toEqual(30);
        expect(result.length).not.toEqual(25);
    });
    test('all dna strands in the array are likely to survive', () => {
        const listOfSurvivors = result.map((pila) => pila.willLikelySurvive());
        const willAllSurvive = listOfSurvivors.every(
            (didIsurvive) => didIsurvive,
        );
        expect(willAllSurvive).toBe(true);
    });
    test('it returns false when 1 pila is replaced with one will no tsurvive', () => {
        // Function to create a Pila instance that is not likely to survive
        const createNonSurvivor = () => {
            let nonSurvivor;

            do {
                const dnaStrand = mockUpStrand();
                nonSurvivor = pilaFactory(31, dnaStrand);
            } while (nonSurvivor.willLikelySurvive());
            return nonSurvivor;
        };

        // Function to replace one item in the array with a non-surviving Pila
        const replaceWithNonSurvivor = (array) => {
            const nonSurvivor = createNonSurvivor();
            array[0] = nonSurvivor;
        };
        // creates an array with 30 pila and replaces 1 with an unhealthy one.
        const strong29 = strong30();
        replaceWithNonSurvivor(strong29);

        // checks that all items return true
        const willAllSurvive = strong29.every((pila) =>
            pila.willLikelySurvive(),
        );
        expect(willAllSurvive).toBe(false);
    });
});

describe('complementStrand()', () => {
    const dnaStrand = ['A', 'T', 'C', 'G', 'A', 'C'];
    const expectedComplement = ['T', 'A', 'G', 'C', 'T', 'G'];
    const pila1 = pilaFactory(1, dnaStrand);
    it('should be a method of the factory (a function)', () => {
        expect(typeof pila1.complementStrand).toBe('function');
    });

    it('should return the complimentary DNA strand', () => {
        const complementStrand = pila1.complementStrand();
        expect(complementStrand).toEqual(expectedComplement);
    });
});

describe('findMostRelated()', () => {
    let testInstances;

    beforeEach(() => {
        testInstances = [
            pilaFactory(1, [
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
            ]),
            pilaFactory(2, [
                'A',
                'T',
                'C',
                'G',
                'G',
                'G',
                'C',
                'G',
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
            ]),
            pilaFactory(3, [
                'T',
                'G',
                'C',
                'A',
                'T',
                'A',
                'C',
                'G',
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
            ]),
            pilaFactory(4, [
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
                'G',
                'A',
                'T',
                'C',
            ]),
            // Identical to specimen 1
        ];
    });

    it('should return the 2 most related pila', () => {
        const [mostRelated1, mostRelated2] = findMostRelated(testInstances);
        expect(mostRelated1.specimenNum).toBe(1);
        expect(mostRelated2.specimenNum).toBe(4);
    });
});
