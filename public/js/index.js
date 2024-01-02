
const issueTemplate = document.querySelector('#issue-template')

// If issueTemplate is not present on the page, just ignore and do not listen for issues messages.
if (issueTemplate) {
  await import('../socket.io/socket.io.js')

  // Create a socket connection using Socket.IO.

  // 👎 BAD PROGRAMMER, NO DONUT!
  // CAUSE: Does not work with subdirectories.
  // const socket = window.io()

  // 🎉 This should work with any subdirectory.
  const base = document.querySelector('base')
  const path = base
    ? (new URL('socket.io', base.href)).pathname
    : '/socket.io'
  const socket = window.io.connect('/', { path })

  // Listen for "issues/create" message from the server.
  socket.on('issues/create', (issue) => insertIssueRow(issue))
  socket.on('issues/update', (issue) => updateIssueRow(issue))
  socket.on('issues/open', (issue) => openIssueRow(issue))
  socket.on('issues/close', (issue) => closeIssueRow(issue))
}

/**
 * Inserts a issue row at the end of the issue table.
 *
 * @param {object} issue - The issue to add.
 */
function updateIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  // Only add a issue if it's not already in the list.
  if (issueList.querySelector(`[data-id="${issue.gitlabID}"]`)) {
    const issueNode = issueList.querySelector(`[data-id="${issue.gitlabID}"]`)
    const titleCell = issueNode.querySelector('#title')
    const descriptionCell = issueNode.querySelector('#description')
    titleCell.innerHTML = 'The issue: ' + issue.title
    descriptionCell.innerHTML = 'The description: ' + issue.description
    issueList.append(issueNode)
  }
}

/**
 * Opens a issue row.
 *
 * @param {object} issue - The issue to add.
 */
function openIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  // Only add a issue if it's not already in the list.
  if (issueList.querySelector(`[data-id="${issue.gitlabID}"]`)) {
    const issueNode = issueList.querySelector(`[data-id="${issue.gitlabID}"]`)
    const openorcloselink = issueNode.querySelector('#openorcloselink')
    openorcloselink.textContent = 'Close'
    openorcloselink.href = `./issues/${issue.gitlabID}/close`
    issueList.append(issueNode)
  }
}

/**
 * Closes a issue row.
 *
 * @param {object} issue - The issue to add.
 */
function closeIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  // Only add a issue if it's not already in the list.
  if (issueList.querySelector(`[data-id="${issue.gitlabID}"]`)) {
    const issueNode = issueList.querySelector(`[data-id="${issue.gitlabID}"]`)
    const openorcloselink = issueNode.querySelector('#openorcloselink')
    openorcloselink.textContent = 'Open'
    openorcloselink.href = `./issues/${issue.gitlabID}/open`
    issueList.append(issueNode)
  }
}

/**
 * Inserts a issue row at the end of the issue table.
 *
 * @param {object} issue - The issue to add.
 */
function insertIssueRow (issue) {
  const issueList = document.querySelector('#issue-list')
  // Only add a issue if it's not already in the list.
  if (!issueList.querySelector(`[data-id="${issue.gitlabID}"]`)) {
    const issueNode = issueTemplate.content.cloneNode(true)

    const issueRow = issueNode.querySelector('tr')
    const avatarCell = issueNode.querySelector('#avatar')
    const titleCell = issueNode.querySelector('#title')
    const descriptionCell = issueNode.querySelector('#description')

    issueRow.setAttribute('data-id', issue.gitlabID)

    const avatarImg = document.createElement('img')
    avatarImg.src = issue.avatar
    avatarImg.setAttribute('crossorigin', 'anonymous')
    avatarCell.innerHTML = ''
    avatarCell.appendChild(avatarImg)

    titleCell.textContent = 'The issue: ' + issue.title
    descriptionCell.textContent = 'The issue: ' + issue.description

    const openorcloselink = issueNode.querySelector('#openorcloselink')
    openorcloselink.textContent = 'Close'
    openorcloselink.href = `./issues/${issue.gitlabID}/close`

    issueList.append(issueNode)
  }
} // i got inspiration here: https://gitlab.lnu.se/1dv026/student/dt222ha/exercises/example-just-task-it-featuring-webhook-and-websocket
