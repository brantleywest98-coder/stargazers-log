async function loadStarredRepositories() {
  const list = document.querySelector("#starred");
  const status = document.querySelector("#status");

  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Could not load repository data (${response.status}).`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      throw new Error("Repository data must be a list.");
    }

    const items = events.map((event) => {
      if (
        typeof event.name !== "string" ||
        !/^[^/]+\/[^/]+$/.test(event.name) ||
        typeof event.starred !== "string" ||
        !event.starred
      ) {
        throw new Error("A repository entry has invalid data.");
      }

      const [owner, repository] = event.name.split("/");
      const item = document.createElement("li");
      const link = document.createElement("a");
      const date = document.createElement("time");

      link.href = `https://github.com/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`;
      link.textContent = event.name;
      date.dateTime = event.starred;
      date.textContent = ` — starred ${event.starred}`;
      item.append(link, date);
      return item;
    });

    list.replaceChildren(...items);
    status.textContent = events.length
      ? `${events.length} starred repositories`
      : "No starred repositories yet.";
  } catch (error) {
    status.textContent = `Unable to show starred repositories: ${error.message}`;
  }
}

loadStarredRepositories();
