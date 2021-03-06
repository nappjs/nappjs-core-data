const assert = require("assert");
const path = require("path");
const moment = require("moment");

process.env.SCRIPTS_PATH = path.join(__dirname, "../scripts");
const napp = require("nappjs").NewNappJS();

describe("seeds", () => {
  before(() => {
    napp.addPlugin("nappjs-core-data", path.join(__dirname, "../index.js"));
    return napp.load();
  });

  beforeEach(() => {
    let coredata = napp.getService("nappjs-core-data");
    return coredata.syncSchema({ force: true });
  });
  after(() => {
    let coredata = napp.getService("nappjs-core-data");
    return coredata.stop();
  });

  it("should run test seed", async () => {
    await napp.runScript("seed", "test");

    const context = napp.getService("nappjs-core-data").createContext();

    let people = await context.getObjects("Person");

    assert.equal(people.length, 2);

    let chuck = await context.getObjectWithId("Person", 999);
    assert.equal(chuck.id, 999);
    assert.equal(chuck.firstname, "Chuck");
    assert.equal(chuck.lastname, "Norris");
    assert.equal(moment(chuck.birthdate).year(), 1900);

    let company = await chuck.getCompany();
    assert.ok(company);
    assert.equal(company.name, "Test company");

    let john = await context.getObjectWithId("Person", 666);
    assert.equal(john.id, 666);
    assert.equal(john.firstname, "John");
    assert.equal(john.lastname, "Doe");

    let company2 = await john.getCompany();
    assert.ok(company2);
    assert.equal(company2.name, "Another company");

    return context.saveAndDestroy();
  });
});
