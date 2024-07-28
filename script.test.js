const { returnRandBase, mockUpStrand, pilaFactory } = require('./script.js');

describe('returnRandBase()', () => {
    it('return a base at random either "A", "T", "C" or "G"', () => {
        const bases = ['A', 'T', 'C', 'G'];
        const result = returnRandBase();
        expect(bases).toContain(result);
    });
    it('testing with other non-base letters', () => {
        const nonBases = ['E', 'S', 'B', 'H', 'Y', 'Z'];
        const result = returnRandBase();
        expect(nonBases).not.toContain(result);
    });
});

describe('mockUpStrand()', () => {
    it('should return an array with 15 elements', () => {
        const result = mockUpStrand();
        expect(result).toHaveLength(15);
    });
    it('should contain only A, T, C, or G', () => {
        const valtestIdBases = ['A', 'T', 'C', 'G'];
        const result = mockUpStrand();
        result.forEach((base) => expect(valtestIdBases).toContain(base));
    });
});

describe('pilaFactory()', () => {
    it('should return an object', () => {
        const result = pilaFactory();
        expect(result).toBeInstanceOf(Object);
    });
    it('should return an object with testId and dna strand', () => {
        const strand = mockUpStrand();
        const testId = 1;
        const sample = { specimenNum: testId, dna: strand };
        const newPila = pilaFactory(testId, strand);
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
        newPila = pilaFactory(testId, testStrand); // newPila is a new object with id and dnaStrand, and a mutate() method
        originalDNA = [...newPila.dna];
        mutatedPila = newPila.mutate();
    });

    it('should return a mutated dna with one random base different', () => {
        expect(originalDNA).not.toEqual(mutatedPila);
    });

    it('the rest of the strand is not changed', () => {
        const restOfOrigStrand = newPila.dna.slice(1);
        const restOfMutStrand = mutatedPila.dna.slice(1);
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
