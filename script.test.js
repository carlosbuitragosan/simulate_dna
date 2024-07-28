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
