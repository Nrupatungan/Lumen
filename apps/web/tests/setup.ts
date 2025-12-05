import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as vitest from "@testing-library/jest-dom/vitest";

expect.extend(vitest);

afterEach(() => {
  cleanup();
});
