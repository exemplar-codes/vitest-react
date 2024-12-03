import { vi } from "vitest";
import "./src/index.css";
import "./src/App.css";
import "@testing-library/jest-dom/vitest"; // needed for .toBeVisible and othern UIs matchers to work https://github.com/testing-library/jest-dom/issues/567#issuecomment-1880205132

// Fixes lottie cannot set ctx.style since its null error
// https://github.com/felippenardi/lottie-react-web/issues/21#issuecomment-2118902716
HTMLCanvasElement.prototype.getContext = () => {
  return {
    fillStyle: "",
    fillRect: vi.fn(),
  };
};

vi.mock("./src/utils/common", async () => {
  // Import the actual module to retain the original implementation
  const actual = await vi.importActual("./src/utils/common");

  return {
    ...actual, // Spread the original implementations
    subdomain: vi.fn(() => "volodeptsg"), // Override the specific function you want to mock
  };
});
