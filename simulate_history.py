
import os
import subprocess
from datetime import datetime, timedelta

# Configuration
REPO_PATH = "/Users/manupalmac/FSDE"
AUTHOR_NAME = "Manu Pal"
AUTHOR_EMAIL = "manupal8954@gmail.com"

# Define commits: (Days ago, Message, [List of file paths relative to REPO_PATH])
# Note: 'All undracked' is not used, explicitly listing files for better control.
COMMITS = [
    (30, "Initial commit: Project Idea and Readme", ["Idea.md", "README.md"]),
    (29, "Setup project structure and dependencies", ["server/package.json", "client/package.json", ".gitignore"]),
    (28, "Configure environment and build tools", ["server/.env", "client/vite.config.js", "client/postcss.config.js"]),
    (25, "Define database schema with Prisma", ["server/prisma/schema.prisma"]),
    (24, "Implement Authentication utilities", ["server/src/utils/auth.js"]),
    (23, "Add Auth Middleware", ["server/src/middleware/authMiddleware.js"]),
    (22, "Implement Auth Controller and Routes", ["server/src/controllers/authController.js", "server/src/routes/authRoutes.js"]),
    (21, "Setup Express App configuration", ["server/src/app.js"]),
    (20, "Initialize Server entry point", ["server/src/index.js"]),
    (19, "Implement Product management (CRUD)", ["server/src/controllers/productController.js", "server/src/routes/productRoutes.js"]),
    (18, "Implement Shopping Cart logic", ["server/src/controllers/cartController.js", "server/src/routes/cartRoutes.js"]),
    (17, "Implement Order processing and history", ["server/src/controllers/orderController.js", "server/src/routes/orderRoutes.js"]),
    (16, "Add admin promotion script", ["server/scripts/promoteAdmin.js"]),
    (15, "Frontend: Setup Tailwind CSS", ["client/src/index.css"]),
    (14, "Frontend: Create Main entry point", ["client/src/main.jsx"]),
    (13, "Frontend: Implement Auth Context", ["client/src/context/AuthContext.jsx"]),
    (12, "Frontend: Create Navbar component", ["client/src/components/Navbar.jsx"]),
    (11, "Frontend: Implement Home Page", ["client/src/pages/Home.jsx"]),
    (10, "Frontend: Create Login Page", ["client/src/pages/Login.jsx"]),
    (9, "Frontend: Create Register Page", ["client/src/pages/Register.jsx"]),
    (8, "Frontend: Implement Cart Context", ["client/src/context/CartContext.jsx"]),
    (7, "Frontend: Create Cart Page", ["client/src/pages/Cart.jsx"]),
    (6, "Frontend: Create Checkout Page", ["client/src/pages/Checkout.jsx"]),
    (5, "Frontend: Configure main App routing", ["client/src/App.jsx"]),
    (4, "Add verification scripts", ["server/scripts/verifyFlow.js"]),
    (1, "Final cleanup and build artifacts", ["client/dist", "server/prisma/migrations"]), 
]

def run_git_cmd(args):
    result = subprocess.run(["git"] + args, cwd=REPO_PATH, check=True, capture_output=True, text=True)
    return result.stdout.strip()

def main():
    print(f"Starting simulate_history in {REPO_PATH}")
    
    # 1. Reset Git Repo
    if os.path.exists(os.path.join(REPO_PATH, ".git")):
        print("Removing existing .git directory...")
        subprocess.run(["rm", "-rf", ".git"], cwd=REPO_PATH, check=True)
    
    run_git_cmd(["init"])
    run_git_cmd(["config", "user.name", AUTHOR_NAME])
    run_git_cmd(["config", "user.email", AUTHOR_EMAIL])
    
    # Check current branch name (main or master)
    branch = run_git_cmd(["branch", "--show-current"])
    if not branch:
        branch = "main" # default usually
        # Create initial empty commit to establish branch? No, just commit.
    
    now = datetime.now()
    
    for days_ago, message, files in COMMITS:
        commit_date = now - timedelta(days=days_ago)
        date_str = commit_date.strftime("%Y-%m-%dT%H:%M:%S")
        
        # Git add specific files
        # Check if files exist before adding
        files_to_add = []
        for file_path in files:
            full_path = os.path.join(REPO_PATH, file_path)
            # Handle directory adding (like migrations or dist)
            if os.path.exists(full_path):
                files_to_add.append(file_path)
            else:
                print(f"Warning: File {file_path} does not exist, skipping.")
        
        if not files_to_add:
            print(f"Skipping commit '{message}' as no files found.")
            continue

        run_git_cmd(["add", "-f"] + files_to_add)
        
        env = os.environ.copy()
        env["GIT_AUTHOR_DATE"] = date_str
        env["GIT_COMMITTER_DATE"] = date_str
        
        subprocess.run(
            ["git", "commit", "-m", message],
            cwd=REPO_PATH,
            env=env,
            check=False # Don't error if nothing to commit (e.g. empty changeset)
        )
        print(f"Committed: {message} ({date_str})")

    # Final commit for anything remaining
    run_git_cmd(["add", "."])
    subprocess.run(
        ["git", "commit", "-m", "Final project state"],
        cwd=REPO_PATH,
        check=False
    )
    print("Simulate history completed.")

if __name__ == "__main__":
    main()
