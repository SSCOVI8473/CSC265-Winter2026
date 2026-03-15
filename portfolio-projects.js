"use strict";

const githubUsers = ["s-scoville", "SSCOVI8473"];
const featuredContainer = document.getElementById("featuredProjects");
const portfolioContainer = document.getElementById("portfolioProjects");
const featuredSection = document.getElementById("featuredProjectsSection");
const portfolioSection = document.getElementById("portfolioProjectsSection");
const projectsStatus = document.getElementById("projectsStatus");

async function fetchReposForUser(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, {
        headers: {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28"
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub request failed for ${username}: ${response.status}`);
    }

    return response.json();
}

function normalizeTopic(topic) {
    return String(topic).trim().toLowerCase();
}

function hasTopic(repo, topicName) {
    if (!Array.isArray(repo.topics)) {
        return false;
    }

    return repo.topics.map(normalizeTopic).includes(normalizeTopic(topicName));
}

function formatDate(dateString) {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function getDisplayDescription(repo) {
    if (repo.description && repo.description.trim() !== "") {
        return repo.description.trim();
    }

    return "No description provided yet.";
}

function getDisplayTopics(repo) {
    if (!Array.isArray(repo.topics)) {
        return [];
    }

    return repo.topics
        .map(normalizeTopic)
        .filter(topic => topic !== "portfolio" && topic !== "featured")
        .slice(0, 4);
}

function createTopicBadges(repo) {
    const topics = getDisplayTopics(repo);

    if (topics.length === 0) {
        return "";
    }

    return `
        <div class="project-topics">
            ${topics.map(topic => `<span class="project-badge">${topic}</span>`).join("")}
        </div>
    `;
}

function createProjectCard(repo) {
    const language = repo.language ? repo.language : "Not specified";
    const updatedDate = formatDate(repo.updated_at);
    const homepageLink = repo.homepage && repo.homepage.trim() !== ""
        ? `<a class="project-btn project-btn-secondary" href="${repo.homepage}" target="_blank" rel="noopener">Live Demo</a>`
        : "";

    return `
        <article class="github-project-card">
            <div class="project-card-header">
                <h4 class="project-card-title">${repo.name}</h4>
                <p class="project-card-meta">
                    <span><strong>Language:</strong> ${language}</span>
                    <span><strong>Updated:</strong> ${updatedDate}</span>
                </p>
            </div>

            <p class="project-card-description">${getDisplayDescription(repo)}</p>

            ${createTopicBadges(repo)}

            <div class="project-card-actions">
                <a class="project-btn" href="${repo.html_url}" target="_blank" rel="noopener">View Repository</a>
                ${homepageLink}
            </div>
        </article>
    `;
}

function renderProjects(repos, container) {
    container.innerHTML = repos.map(createProjectCard).join("");
}

function dedupeRepos(repos) {
    const seen = new Set();

    return repos.filter(repo => {
        const key = repo.full_name;

        if (seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

function sortRepos(repos) {
    return repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

async function loadPortfolioProjects() {
    try {
        const repoGroups = await Promise.all(githubUsers.map(fetchReposForUser));
        const allRepos = dedupeRepos(repoGroups.flat());

        const taggedRepos = allRepos.filter(repo => hasTopic(repo, "featured") || hasTopic(repo, "portfolio"));
        const featuredRepos = sortRepos(taggedRepos.filter(repo => hasTopic(repo, "featured"))).slice(0, 3);
        const portfolioRepos = sortRepos(
            taggedRepos.filter(repo => hasTopic(repo, "portfolio") && !hasTopic(repo, "featured"))
        );

        projectsStatus.textContent = "";

        if (featuredRepos.length > 0) {
            renderProjects(featuredRepos, featuredContainer);
        } else {
            featuredSection.style.display = "none";
        }

        if (portfolioRepos.length > 0) {
            renderProjects(portfolioRepos, portfolioContainer);
        } else {
            portfolioSection.style.display = "none";
        }

        if (featuredRepos.length === 0 && portfolioRepos.length === 0) {
            projectsStatus.innerHTML = `
                <p class="projects-empty">
                    No GitHub repositories are currently tagged for display.
                    Add the topic <strong>featured</strong> or <strong>portfolio</strong>
                    to a public repository to have it appear here automatically.
                </p>
            `;
        }
    } catch (error) {
        console.error("Unable to load GitHub projects:", error);

        featuredSection.style.display = "none";
        portfolioSection.style.display = "none";

        projectsStatus.innerHTML = `
            <p class="projects-empty">
                GitHub projects could not be loaded at this time. Please try again later.
            </p>
        `;
    }
}

loadPortfolioProjects();