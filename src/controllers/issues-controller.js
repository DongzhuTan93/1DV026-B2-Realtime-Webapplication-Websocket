/**
 * Module for the issuesController.
 *
 * @author Donghu Tan
 * @version 2.0.0
 */

import { Issue } from '../models/issue.js'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Displays a list of issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = {
        issues: (await Issue.find())
          .map(issues => issues.toObject())
      }

      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns a HTML form for closing a issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async showClosePage (req, res) {
    try {
      console.log(req.params.id)
      const issues = await Issue.findOne({ gitlabID: req.params.id })

      res.render('issues/close', { viewData: issues.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Returns a HTML form for opeining a issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async showOpenPage (req, res) {
    try {
      console.log(req.params.id)
      const issues = await Issue.findOne({ gitlabID: req.params.id })

      res.render('issues/open', { viewData: issues.toObject() })
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('..')
    }
  }

  /**
   * Close the specified issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async closeIssue (req, res) {
    try {
      const config = {
        method: 'PUT',
        headers: {
          'PRIVATE-TOKEN': process.env.GITLAB_API_SECRET
        }
      }
      console.log(process.env.GITLAB_API_SECRET)
      console.log('...................................')
      console.log(req)
      const url = `https://gitlab.lnu.se/api/v4/projects/31124/issues/${req.params.id}?state_event=close`
      const result = await fetch(url, config)
      console.log(result)

      const filter = { gitlabID: req.params.id }
      const update = { state: 'closed' }
      await Issue.findOneAndUpdate(filter, update)

      res.io.emit('issues/close', req.params.id)

      req.session.flash = { type: 'success', text: 'The issues was closed successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./close')
    }
  }

  /**
   * Open the specified issues.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  async openIssue (req, res) {
    try {
      const config = {
        method: 'PUT',
        headers: {
          'PRIVATE-TOKEN': process.env.GITLAB_API_SECRET
        }
      }
      console.log(process.env.GITLAB_API_SECRET)
      const url = `https://gitlab.lnu.se/api/v4/projects/31124/issues/${req.params.id}?state_event=reopen`
      const result = await fetch(url, config)
      console.log(result)

      const filter = { gitlabID: req.params.id }
      const update = { state: 'opened' }
      await Issue.findOneAndUpdate(filter, update)

      res.io.emit('issues/open', req.params.id)

      req.session.flash = { type: 'success', text: 'The issues was opened successfully.' }
      res.redirect('..')
    } catch (error) {
      req.session.flash = { type: 'danger', text: error.message }
      res.redirect('./close')
    }
  }
}
