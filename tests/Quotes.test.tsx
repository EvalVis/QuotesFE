import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { quotes } from "./fakes/quotes";
// import QuotesView from "../src/views/QuotesView";
import SavedQuotesView from "../src/views/SavedQuotesView";
import PopularQuotesView from "../src/views/PopularQuotesView";
import { unauthenticated } from "./fakes/auth0";

describe("Quotes are displayed", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  beforeAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/api/quotes/random")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([quotes[0]]),
        });
      }
      if (url.includes("/api/quotes/saved")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([quotes[1], quotes[2]]),
        });
      }
      if (url.includes("/api/quotes/popular")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ quotes: [quotes[0], quotes[1]], total: 200 }),
        });
      }
      return Promise.reject(new Error("URL not found"));
    });
  });

  it("Main page quotes are displayed", async () => {
    vi.doMock("@auth0/auth0-react", () => ({
      useAuth0: unauthenticated,
    }));
    const { default: QuotesView } = await import("../src/views/QuotesView");

    render(<QuotesView />);
    expect(await screen.findByText(`"${quotes[0].quote}"`)).toBeDefined();
    expect(await screen.findByText(`- ${quotes[0].author}`)).toBeDefined();
    const lifeTags = await screen.findAllByText("#life");
    expect(lifeTags.length).toBeGreaterThanOrEqual(1);
    const purposeTags = await screen.findAllByText("#purpose");
    expect(purposeTags.length).toBeGreaterThanOrEqual(1);
  });

  it("Saved quotes are displayed", async () => {
    render(<SavedQuotesView />);

    await waitFor(() => {
      expect(screen.getByText(`"${quotes[1].quote}"`)).toBeDefined();
      expect(screen.getByText(`- ${quotes[1].author}`)).toBeDefined();
      const lifeTags = screen.getAllByText("#life");
      expect(lifeTags.length).toBeGreaterThanOrEqual(1);
      const wisdomTags = screen.getAllByText("#wisdom");
      expect(wisdomTags.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("Popular quotes are displayed", async () => {
    render(<PopularQuotesView />);

    await waitFor(() => {
      expect(screen.getByText(`"${quotes[0].quote}"`)).toBeDefined();
      expect(screen.getByText(`- ${quotes[0].author}`)).toBeDefined();
      expect(screen.getByText("Top 100 Popular Quotes")).toBeDefined();
    });
  });

  it("Filters quotes by author (exact match, case-insensitive)", async () => {
    vi.doMock("@auth0/auth0-react", () => ({
      useAuth0: unauthenticated,
    }));
    const { default: QuotesView } = await import("../src/views/QuotesView");
    render(<QuotesView />);

    await screen.findByText(`"${quotes[0].quote}"`);

    const authorInput = screen.getByLabelText(/Filter by author/i);
    expect(authorInput).toBeDefined();

    // Exact match ignoring case: "not important" matches "Not important"
    fireEvent.change(authorInput, { target: { value: "not important" } });
    expect(screen.getByText(`"${quotes[0].quote}"`)).toBeDefined();
    expect(screen.getByText(`- ${quotes[0].author}`)).toBeDefined();

    // Partial match does not match: "not imp" should show no results
    fireEvent.change(authorInput, { target: { value: "not imp" } });
    expect(screen.getByText(/No quotes by "not imp"/)).toBeDefined();
  });

  it("Saved quotes are ordered from newest to oldest", async () => {
    render(<SavedQuotesView />);

    const firstQuote = await screen.findByText(`"${quotes[2].quote}"`);
    const secondQuote = await screen.findByText(`"${quotes[1].quote}"`);

    expect(firstQuote.compareDocumentPosition(secondQuote)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });
});
