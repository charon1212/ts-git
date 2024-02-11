import { scenario1 } from "./scenarios/scenario1";
import { ScenarioTest } from "./util/ScenarioTest";

let scenarioTest: ScenarioTest;

describe('scenario', () => {
  beforeAll(() => {
    ScenarioTest.beforeAll();
  });

  it('scenario1', async () => {
    scenarioTest = new ScenarioTest('scenario1');
    scenario1(scenarioTest);
  });
});
