const { clickElement, getText } = require("./lib/commands.js");

let page;

beforeEach(async () => {
  let day = 2;
  page = await browser.newPage();
  await page.goto("https://qamid.tmweb.ru/client/index.php");
  await clickElement(page, `body > nav > a:nth-child(${day}) > span.page-nav__day-week`);
  await clickElement(page, "body > main > section > div.movie-seances__hall > ul > li > a");
}, 60000);

afterEach(() => {
  page.close();
});
describe("Ticket booking", () => {
  test("Booking one ticket", async () => {
    let row = 3;
    let place1 = 5;
    await clickElement(page, `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${place1})`);
    await clickElement(page, ".acceptin-button");
    await page.waitForNavigation();
    const actual = await getText(page, "h2");
    const expected = "Вы выбрали билеты:";
    expect(actual).toContain(expected);
  }, 50000);

  test("Booking two tickets", async () => {
    let row = 6;
    let place2 = 5;
    let place3 = 6;
    await clickElement(page, `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${place2})`);
    await clickElement(page, `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${place3})`);
    await clickElement(page, ".acceptin-button");
    await page.waitForNavigation();
    const actual = await getText(page, "h2");
    const expected = "Вы выбрали билеты:";
    expect(actual).toContain(expected);
  }, 5000);

  test("Trying to book a occupied seat", async () => {
    let row = 4;
    let place4 = 2;
    let day = 1;
    await clickElement(page, `div.buying-scheme__wrapper > div:nth-child(${row}) > span:nth-child(${place4})`);
    try {
      await page.click(`body > nav > a:nth-child(${day}) > span.page-nav__day-week`);
    } catch (error) {
      return;
    }
    await clickElement(page, "body > main > section > div.movie-seances__hall > ul > li > a");
    const isButtonDisabled = await page.$eval(".acceptin-button", (el) => el.disabled);
    expect(isButtonDisabled).toEqual(true);
  }, 50000);
})