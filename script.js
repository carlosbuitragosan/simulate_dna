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
        const percentage = ((matchCount / this.dna.length) * 100).toFixed(2);
        console.log(
            `Specimen #${this.specimenNum} and Specimen #${otherPila.specimenNum} have ${percentage}% DNA in common.`,
        );
    },
});

module.exports = { returnRandBase, mockUpStrand, pilaFactory };
