/**
 * issues routes.
 *
 * @author Donghuz Tan
 * @version 2.0.0
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

export const router = express.Router()

const controller = new IssuesController()

// Map HTTP verbs and route paths to controller action methods.

router.get('/', (req, res, next) => controller.index(req, res, next))

router.get('/:id/close', (req, res, next) => controller.showClosePage(req, res, next))
router.post('/:id/close', (req, res, next) => controller.closeIssue(req, res, next))

router.get('/:id/open', (req, res, next) => controller.showOpenPage(req, res, next))
router.post('/:id/open', (req, res, next) => controller.openIssue(req, res, next))
