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
    parser.registerFunction('regex', (value: string, pattern: string) => {
        console.log('regex func', value, pattern)
        if (typeof value !== 'string') return false;
        const regex = new RegExp(pattern); 
        return regex.test(value);
        });
    parser.registerFunction('substringEquals', (str: string, start: number, end: number, substr: string) => {
        if (typeof str !== 'string') return '';
        console.log(str, start, end, str.substring(start, end), substr)
        return str.substring(start, end) == substr;
        }); 
    parser.registerFunction('substring', (str: string, start: number, end: number) => {
        if (typeof str !== 'string') return '';
        return str.substring(start, end);
        }); 
    let results = {results: answers}
    return parser.parseAndEval(logic,results)
}
