import React from "react";
function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-stone-200 dark:border-stone-800">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 xl:px-40 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                        © {currentYear} NoteIt. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a
                            className="text-sm text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary"
                            href="#"
                        >
                            Privacy Policy
                        </a>
                        <a
                            className="text-sm text-stone-600 hover:text-primary dark:text-stone-400 dark:hover:text-primary"
                            href="#"
                        >
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
