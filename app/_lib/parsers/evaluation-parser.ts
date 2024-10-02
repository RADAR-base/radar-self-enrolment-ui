import Parser from 'morph-expressions';

interface Answers {
    [key: string]: string | number | boolean ;
}

/**
 * Parses and evaluates a logic string by replacing placeholders with corresponding values from the `answers` object
 * and performing logical transformations. Supports transformations such as `lower()` and `upper()` for string cases.
 *
 * @param logic - The logic string containing conditions, placeholders, and expressions.
 * The placeholders are wrapped in square brackets (e.g., [field_name]) and are replaced by corresponding values
 * from the `answers` object. The logic string may include conditions with comparison operators, logical `or`/`and`
 * (which will be replaced by `||`/`&&`), and equality checks.
 *
 * @param answers - An object containing key-value pairs where the key represents a field name and
 * the value is the corresponding value to be injected into the logic string.
 * The value can be a string, number, or boolean.
 *
 * @return {boolean} - Returns the result of evaluating the logic string after transformations.
 *
 * @example
 * // Example logic string
 * const logic = "[age] >= 18 && lower([city]) == 'london' && [consent] == true";
 *
 * // Example answers object
 * const answers = {
 *   age: 25,
 *   city: "London",
 *   consent: true
 * };
 *
 * const result = parseAndEvalLogic(logic, answers);
 * console.log(result); // Outputs: true
 */
export function parseAndEvalLogic(logic: string, answers: Answers): boolean {
    const parser = new Parser();

    logic = logic.replace(/[\[\]]/g, '')
        .replace(/\(([^()]+)\)/g, '[$1]')
        .replace(/ or /g, ' || ')
        .replace(/ and /g, ' && ')
        .replace(/ = /g, ' == ');

    logic = logic.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (match) => {
        const value = answers[match];
        // Return the JSON representation of the value if found, otherwise return the original match
        return value !== undefined ? JSON.stringify(value) : match;
    });

    console.log("Started evaluating 2: ", logic);

    const caseReplacement = logic.replace(/lower\[['"]([^'"]+)['"]]/gi, (match, p1) => {
        return `'${p1.toLowerCase()}'`;
    })
        .replace(/upper\[['"]([^'"]+)['"]]/gi, (match, p1) => {
            return `'${p1.toUpperCase()}'`;
        });

    return parser.parse(caseReplacement).eval();
}
