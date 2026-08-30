document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('search-input').value.trim();
    if (username) {
        fetchGitHubProfile(username);
    }
});

async function fetchGitHubProfile(username) {
    const profileCard = document.getElementById('profile-card');
    const errorMessage = document.getElementById('error-message');
    const loader = document.getElementById('loader');

    // Reset view states and trigger loading sequence
    profileCard.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        // Fetch User Base Profile Data
        const userResponse = await fetch(`https://github.com{username}`);
        
        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                throw new Error('User not found');
            } else {
                throw new Error('An error occurred while fetching data');
            }
        }
        
        const userData = await userResponse.json();

        // Fetch user repositories, sorted by most recent push updates
        const reposResponse = await fetch(`https://github.com{username}/repos?sort=pushed&per_page=5`);
        const reposData = await reposResponse.json();

        // Populate Interface Data
        displayProfile(userData, reposData);
        
    } catch (error) {
        console.error(error);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide loader regardless of success or failure
        loader.classList.add('hidden');
    }
}

function displayProfile(user, repos) {
    const profileCard = document.getElementById('profile-card');
    
    // Set text elements and images
    document.getElementById('profile-avatar').src = user.avatar_url;
    document.getElementById('profile-name').textContent = user.name || user.login;
    document.getElementById('profile-followers').textContent = `👥 ${user.followers} followers`;
    document.getElementById('profile-bio').textContent = user.bio || "This profile has no bio.";

    // Render 5 Most Recent Public Repositories
    const reposList = document.getElementById('repos-list');
    reposList.innerHTML = ''; // Clear prior entries

    if (repos.length === 0) {
        reposList.innerHTML = '<li><span style="color: var(--text-secondary); font-size: 0.9rem;">No public repositories found.</span></li>';
    } else {
        repos.forEach(repo => {
            const listItem = document.createElement('li');
            const repoLink = document.createElement('a');
            repoLink.href = repo.html_url;
            repoLink.target = '_blank';
            repoLink.rel = 'noopener noreferrer';
            repoLink.textContent = repo.name;
            
            listItem.appendChild(repoLink);
            reposList.appendChild(listItem);
        });
    }

    // Reveal populated elements
    profileCard.classList.remove('hidden');
}
