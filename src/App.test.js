import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("renders users when API call succeeds", async () => {
    const fakeUsers = [
      { customer: "Kevin", month: "January", amount: 120 },
      { customer: "Kevin", month: "February", amount: 100 },
      { customer: "Kiran", month: "January", amount: 180 },
      { customer: "Kiran", month: "February", amount: 200 },
      { customer: "John", month: "January", amount: 50 },
      { customer: "John", month: "February", amount: 100 },
      { customer: "John", month: "March", amount: 300 },
    ];

    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeUsers),
      })
    );

    render(<App />);
    await screen.findAllByText("Kevin");
  });
});
