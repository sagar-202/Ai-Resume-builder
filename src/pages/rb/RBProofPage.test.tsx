/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RBProofPage from './RBProofPage';
import { Toaster } from "@/components/ui/sonner";

// Mock clipboard
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
    },
});

// Mock localStorage fully to avoid jsdom issues
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
});

describe('RBProofPage Validation', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('renders all 3 link inputs', () => {
        render(
            <MemoryRouter>
                <RBProofPage />
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText(/lovable.dev/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/github.com/i)).toBeInTheDocument();
        // The last one is just https://... but we can check specifically
        const inputs = screen.getAllByRole('textbox');
        expect(inputs).toHaveLength(3);
    });

    it('persists proof links in localStorage', async () => {
        const { unmount } = render(
            <MemoryRouter>
                <RBProofPage />
            </MemoryRouter>
        );

        const link = "https://example.com";
        const input = screen.getByPlaceholderText(/lovable.dev/i);
        fireEvent.change(input, { target: { value: link } });

        // Simulate refresh
        unmount();
        render(
            <MemoryRouter>
                <RBProofPage />
            </MemoryRouter>
        );

        expect(screen.getByDisplayValue(link)).toBeInTheDocument();
    });

    it('validates URLs and updates status', () => {
        render(
            <MemoryRouter>
                <RBProofPage />
                <Toaster />
            </MemoryRouter>
        );

        // Enter invalid URL
        const input = screen.getByPlaceholderText(/lovable.dev/i);
        fireEvent.change(input, { target: { value: "invalid-url" } });

        // Verify no shipped banner
        expect(screen.queryByText(/Project 3 Shipped Successfully/i)).not.toBeInTheDocument();
    });

    it('shows Shipped banner ONLY when ALL conditions are met', () => {
        // Setup success conditions
        for (let i = 1; i <= 8; i++) window.localStorage.setItem(`rb_step_${i}_artifact`, "done");
        const allChecked: Record<string, boolean> = {
            "validate-jd": true, "short-jd-warn": true, "skill-grouping": true,
            "round-mapping": true, "score-deterministic": true, "score-toggle": true,
            "persist-refresh": true, "history-save": true, "export-copy": true,
            "no-console-errors": true
        };
        window.localStorage.setItem("prp-test-checklist", JSON.stringify(allChecked));
        window.localStorage.setItem("rb_final_submission", JSON.stringify({
            lovable: "https://lovable.dev/project",
            github: "https://github.com/user/project",
            deploy: "https://project.vercel.app"
        }));

        render(
            <MemoryRouter>
                <RBProofPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Project 3 Shipped Successfully/i)).toBeInTheDocument();
    });

    it('does NOT show Shipped banner if URLs are invalid', () => {
        // Setup success conditions but INVALID URL
        for (let i = 1; i <= 8; i++) window.localStorage.setItem(`rb_step_${i}_artifact`, "done");
        const allChecked: Record<string, boolean> = {
            "validate-jd": true, "short-jd-warn": true, "skill-grouping": true,
            "round-mapping": true, "score-deterministic": true, "score-toggle": true,
            "persist-refresh": true, "history-save": true, "export-copy": true,
            "no-console-errors": true
        };
        window.localStorage.setItem("prp-test-checklist", JSON.stringify(allChecked));
        // Invalid URL
        window.localStorage.setItem("rb_final_submission", JSON.stringify({
            lovable: "broken-url",
            github: "https://github.com/user/project",
            deploy: "https://project.vercel.app"
        }));

        render(
            <MemoryRouter>
                <RBProofPage />
            </MemoryRouter>
        );

        expect(screen.queryByText(/Project 3 Shipped Successfully/i)).not.toBeInTheDocument();
    });

    it('copies correct formatted text', async () => {
        // Setup inputs
        window.localStorage.setItem("rb_final_submission", JSON.stringify({
            lovable: "https://lovable.dev/p",
            github: "https://github.com/u/r",
            deploy: "https://d.app"
        }));

        for (let i = 1; i <= 8; i++) window.localStorage.setItem(`rb_step_${i}_artifact`, "done");
        const allChecked: Record<string, boolean> = {
            "validate-jd": true, "short-jd-warn": true, "skill-grouping": true,
            "round-mapping": true, "score-deterministic": true, "score-toggle": true,
            "persist-refresh": true, "history-save": true, "export-copy": true,
            "no-console-errors": true
        };
        window.localStorage.setItem("prp-test-checklist", JSON.stringify(allChecked));

        render(
            <MemoryRouter>
                <RBProofPage />
                <Toaster />
            </MemoryRouter>
        );

        const copyBtn = screen.getByText(/Copy Final Submission/i);
        fireEvent.click(copyBtn);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("------------------------------------------"));
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("Lovable Project: https://lovable.dev/p"));
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("GitHub Repository: https://github.com/u/r"));
    });
});
