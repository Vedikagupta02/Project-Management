/**
 * Integration test: backend API routes.
 * Run: node scripts/test-api-connection.mjs
 */
import axios from "axios";

const API = process.env.API_URL ?? "http://localhost:8000/api/v1";
const testUser = {
  email: `test_${Date.now()}@example.com`,
  username: `user_${Date.now()}`,
  password: "Test1234",
};

function unwrap(data) {
  if (data?.data !== null && data?.data !== undefined && typeof data.data !== "string") {
    return data.data;
  }
  if (data?.message !== null && data?.message !== undefined && typeof data.message !== "string") {
    return data.message;
  }
  return data?.data;
}

async function run() {
  const results = [];
  const log = (name, ok, detail = "") => results.push({ name, ok, detail });

  try {
    const health = await axios.get(`${API}/healthcheck`);
    log("Healthcheck", health.status === 200);
  } catch (e) {
    log("Healthcheck", false, e.message);
    console.table(results);
    process.exit(1);
  }

  let token = null;

  try {
    await axios.post(`${API}/auth/register`, testUser);
    log("Register", true, testUser.email);
  } catch (e) {
    log("Register", false, e.response?.data?.message ?? e.message);
  }

  try {
    const login = await axios.post(`${API}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    token = unwrap(login.data)?.accessToken;
    log("Login", Boolean(token));
  } catch (e) {
    log("Login", false, e.response?.data?.message ?? e.message);
  }

  if (!token) {
    console.table(results);
    process.exit(1);
  }

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  try {
    const me = await axios.post(`${API}/auth/current-user`, {}, auth);
    log("Current user", Boolean(unwrap(me.data)?.user?._id));
  } catch (e) {
    log("Current user", false, e.response?.data?.message ?? e.message);
  }

  try {
    const projects = await axios.get(`${API}/projects`, auth);
    log("Get projects", Array.isArray(unwrap(projects.data)));
  } catch (e) {
    log("Get projects", false, e.response?.data?.message ?? e.message);
  }

  let projectId = null;
  try {
    const created = await axios.post(
      `${API}/projects`,
      { name: `Test Project ${Date.now()}`, description: "API test" },
      auth
    );
    projectId = unwrap(created.data)?._id;
    log("Create project", Boolean(projectId));
  } catch (e) {
    log("Create project", false, e.response?.data?.message ?? e.message);
  }

  if (projectId) {
    try {
      const project = await axios.get(`${API}/projects/${projectId}`, auth);
      log("Get project by ID", Boolean(unwrap(project.data)?._id));
    } catch (e) {
      log("Get project by ID", false, e.response?.data?.message ?? e.message);
    }

    try {
      const members = await axios.get(`${API}/projects/${projectId}/members`, auth);
      log("Get members", Array.isArray(unwrap(members.data)));
    } catch (e) {
      log("Get members", false, e.response?.data?.message ?? e.message);
    }

    try {
      const tasks = await axios.get(`${API}/projects/${projectId}/tasks`, auth);
      log("Get tasks", Array.isArray(unwrap(tasks.data)));
    } catch (e) {
      log("Get tasks", false, e.response?.data?.message ?? e.message);
    }

    let taskId = null;
    try {
      const task = await axios.post(
        `${API}/projects/${projectId}/tasks`,
        { title: "Test task", description: "API test", status: "todo" },
        auth
      );
      taskId = unwrap(task.data)?._id;
      log("Create task", Boolean(taskId));
    } catch (e) {
      log("Create task", false, e.response?.data?.message ?? e.message);
    }

    if (taskId) {
      try {
        const task = await axios.get(`${API}/projects/${projectId}/tasks/${taskId}`, auth);
        log("Get task by ID", Boolean(unwrap(task.data)?._id));
      } catch (e) {
        log("Get task by ID", false, e.response?.data?.message ?? e.message);
      }
    }

    try {
      const notes = await axios.get(`${API}/projects/${projectId}/notes`, auth);
      log("Get notes", Array.isArray(unwrap(notes.data)));
    } catch (e) {
      log("Get notes", false, e.response?.data?.message ?? e.message);
    }

    try {
      const note = await axios.post(
        `${API}/projects/${projectId}/notes`,
        { content: "Test note from API script" },
        auth
      );
      log("Create note", Boolean(unwrap(note.data)?._id));
    } catch (e) {
      log("Create note", false, e.response?.data?.message ?? e.message);
    }

    try {
      await axios.delete(`${API}/projects/${projectId}`, auth);
      log("Delete project", true);
    } catch (e) {
      log("Delete project", false, e.response?.data?.message ?? e.message);
    }
  }

  try {
    await axios.post(`${API}/auth/logout`, {}, auth);
    log("Logout", true);
  } catch (e) {
    log("Logout", false, e.response?.data?.message ?? e.message);
  }

  console.table(results);
  const failed = results.filter((r) => !r.ok);
  process.exit(failed.length ? 1 : 0);
}

run();
