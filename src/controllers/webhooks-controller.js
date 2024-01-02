/**
 * Module for the WebhooksController.
 *
 * @author Dongzhu Tan
 * @version 2.0.0
 */

import { Issue } from '../models/issue.js'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * Authenticates the webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authenticate (req, res, next) {
    // Use the GitLab secret token to validate the received payload.
    console.log(req.body)
    if (req.headers['x-gitlab-token'] !== process.env.WEBHOOK_SECRET) {
      const error = new Error('Invalid token')
      error.status = 401
      next(error)
      return
    }

    next()
  }

  /**
   * Receives a webhook, and creates a new issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async indexPost (req, res, next) {
    try {
      // Only interested in issues events. (But still, respond with a 200
      // for events not supported.)

      if (req.body.object_attributes.action === 'open') {
        // handle the 'open' action

        const issue = new Issue({

          avatar: req.body.user.avatar_url,
          title: req.body.object_attributes.title,
          description: req.body.object_attributes.description,
          gitlabID: req.body.object_attributes.iid,
          state: req.body.object_attributes.state
        })
        console.log('the issue is:' + issue)
        await issue.save()
        res.io.emit('issues/create', issue.toObject())
      } else if (req.body.object_attributes.action === 'update') {
        // handle the 'update' action
        const updateFields = {}

        if (req.body.changes.title) {
          updateFields.title = req.body.changes.title.current
        }

        if (req.body.changes.description) {
          updateFields.description = req.body.changes.description.current
        }

        if (req.body.changes.state) {
          updateFields.state = req.body.changes.state.current
        }

        const issue = await Issue.findOneAndUpdate(
          { gitlabID: req.body.object_attributes.iid },
          updateFields,
          { new: true }
        )

        res.io.emit('issues/update', issue.toObject())
      } else if (req.body.object_attributes.action === 'reopen') {
        const issue = await Issue.findOneAndUpdate(
          { gitlabID: req.body.object_attributes.iid },
          {
            state: 'opened'
          },
          { new: true }
        )

        res.io.emit('issues/open', issue.toObject())
      } else if (req.body.object_attributes.action === 'close') {
        const issue = await Issue.findOneAndUpdate(
          { gitlabID: req.body.object_attributes.iid },
          {
            state: 'closed'
          },
          { new: true }
        )
        res.io.emit('issues/close', issue.toObject())
      }

      res.status(200).end()
    } catch (error) {
      console.log(error)
      const err = new Error('Internal Server Error')
      err.status = 500
      next(err)
    }
  }
}
