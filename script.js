// Returns a random DNA base
const returnRandBase = () => {
    const dnaBases = ['A', 'T', 'C', 'G'];
    return dnaBases[Math.floor(Math.random() * 4)];
};

// Returns a random single strand of DNA containing 15 bases
const mockUpStrand = () => {
    const newStrand = [];
    for (let i = 0; i < 15; i++) {
        newStrand.push(returnRandBase());
    }
    return newStrand;
};

const pilaFactory = (id, dnaStrand) => ({
    specimenNum: id,
    dna: dnaStrand,

    mutate() {
        const randomBase = Math.floor(Math.random() * this.dna.length);
        let newBase = returnRandBase();
        while (this.dna[randomBase] === newBase) {
            newBase = returnRandBase();
        }
        this.dna[randomBase] = newBase;
        return this;
    },

    compareDNA(otherPila) {
        let matchCount = 0;
        for (let i = 0; i < this.dna.length; i++) {
            if (this.dna[i] === otherPila.dna[i]) {
                matchCount++;
            }
        }
        const percentage = Math.round((matchCount / this.dna.length) * 100);
        console.log(
            `Specimen #${this.specimenNum} and Specimen #${otherPila.specimenNum} have ${percentage}% DNA in common.`,
        );
        return percentage;
    },

    willLikelySurvive() {
        let matchCout = 0;
        for (let i = 0; i < this.dna.length; i++) {
            if (this.dna[i] === 'C' || this.dna[i] === 'G') {
                matchCout++;
            }
        }
        const percentage = Math.round((matchCout / this.dna.length) * 100);
        return percentage >= 60;
    },

    // return the complementary DNA strand
    complementStrand() {
        const complement = {
            A: 'T',
            T: 'A',
            C: 'G',
            G: 'C',
        };
        return this.dna.map((base) => complement[base]);
    },
});

const strong30 = () => {
    const result = [];
    let id = 1;

    while (result.length < 30) {
        const dnaStrand = mockUpStrand();
        const pila = pilaFactory(id, dnaStrand);

        if (pila.willLikelySurvive()) {
            result.push(pila);
            id++;
        }
    }
    return result;
};

const findMostRelated = (instances) => {
    let maxPercentage = 0;
    let mostRelatedPair = [];

    for (let i = 0; i < instances.length; i++) {
        for (let j = i + 1; j < instances.length; j++) {
            const percentage = instances[i].compareDNA(instances[j]);
            if (percentage > maxPercentage) {
                maxPercentage = percentage;
                mostRelatedPair = [instances[i], instances[j]];
            }
        }
    }
    return mostRelatedPair;
};

module.exports = {
    returnRandBase,
    mockUpStrand,
    pilaFactory,
    strong30,
    findMostRelated,
};
