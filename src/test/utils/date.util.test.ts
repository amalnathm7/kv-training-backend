import { compareDateMonts } from "../../utils/date.util";

describe("Test compareDateMonths", () => {
    test("Same date as arguement", () => {
        const currentDate = new Date();
        expect(compareDateMonts(currentDate, currentDate, 1)).toBe(false);
        expect(compareDateMonts(currentDate, currentDate, 0)).toBe(true);
    });
    test("Different date as arguement", () => {
        const currentDate = new Date();
        const date12MontsAgo = new Date();
        date12MontsAgo.setMonth(currentDate.getMonth() - 12);
        expect(compareDateMonts(currentDate, date12MontsAgo, 12)).toBe(true);
        expect(compareDateMonts(currentDate, date12MontsAgo, 11)).toBe(true);
        expect(compareDateMonts(currentDate, date12MontsAgo, 13)).toBe(false);
        const date7MontsAgo = new Date();
        date7MontsAgo.setMonth(currentDate.getMonth() - 7);
        expect(compareDateMonts(currentDate, date7MontsAgo, 7)).toBe(true);
        expect(compareDateMonts(currentDate, date7MontsAgo, 6)).toBe(true);
        expect(compareDateMonts(currentDate, date7MontsAgo, 8)).toBe(false);
    });
});