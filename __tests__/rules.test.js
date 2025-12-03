import { calculateFinalValue, checkRule } from "../assets/js/rules.js";

const createMockVotes = (voteValues) => {
  return voteValues.map((value, index) => ({
    participant: `Participant ${index + 1}`,
    vote: `cartes_${value}`,
  }));
};

describe("Tests des Règles de Vote (rules.js)", () => {
  // Test 1: Échec de l'unanimité (1er tour)
  test("1. checkRule doit échouer si le 1er tour n'est pas unanime (votes différents)", () => {
    const votes = createMockVotes(["8", "5", "8"]);
    expect(checkRule(votes, "moyenne", true)).toBe(false);
  });

  // Test 2: Échec de la Majorité Absolue (Égalité ou Minorité)
  test("2. checkRule doit échouer la majorité absolue en cas d'égalité (2/4 <= 50%)", () => {
    const votes = createMockVotes(["5", "5", "8", "8"]);
    expect(checkRule(votes, "majoriteAbsolue", false)).toBe(false);
  });

  // Test 3: Majorité Relative (Victoire d'un vote non-numérique)
  test("3. calculateFinalValue doit retourner cafe si la majorité relative est atteinte avec un vote non-numérique", () => {
    const votes = createMockVotes(["cafe", "cafe", "interro", "5"]);
    expect(calculateFinalValue(votes, "majoriteRelative", false)).toBe("cafe");
  });

  // Test 4: Unanimité avec vote non-numérique
  test("4. checkRule doit valider l'unanimité si tous les votes sont le même vote non-numérique (cafe)", () => {
    const votes = createMockVotes(["cafe", "cafe", "cafe"]);
    expect(checkRule(votes, "unanimite", false)).toBe(true);
  });
});
