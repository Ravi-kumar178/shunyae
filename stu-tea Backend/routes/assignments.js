const express = require('express')
const { body, validationResult } = require('express-validator')
const Assignment = require('../models/Assignment')
const { authenticateToken, requireTeacher, requireStudent } = require('../middleware/auth')

const router = express.Router()

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create a new assignment (Teacher only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Assignment'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assignment:
 *                   type: object
 *       403:
 *         description: Teacher access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

// Create new assignment (Teacher only)
router.post('/', authenticateToken, requireTeacher, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('deadline').isISO8601().withMessage('Valid deadline date is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const { title, description, subject, deadline } = req.body

    // Create new assignment
    const assignment = new Assignment({
      title,
      description,
      subject,
      deadline: new Date(deadline),
      teacher: req.user._id
    })

    await assignment.save()
    await assignment.populate('teacher', 'name email')

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    })
  } catch (error) {
    console.error('Create assignment error:', error)
    res.status(500).json({ message: 'Failed to create assignment' })
  }
})

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assignments:
 *                   type: array
 *                   items:
 *                     type: object
 */
// Get all assignments (Students can view all, Teachers can view their own)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = {}
    
    // Teachers can only see their own assignments
    if (req.user.role === 'teacher') {
      query.teacher = req.user._id
    }
    // Students can see all active assignments

    const assignments = await Assignment.find(query)
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 })

    res.json({
      message: 'Assignments retrieved successfully',
      assignments
    })
  } catch (error) {
    console.error('Get assignments error:', error)
    res.status(500).json({ message: 'Failed to retrieve assignments' })
  }
})

/**
 * @swagger
 * /api/assignments/{id}:
 *   get:
 *     summary: Get single assignment by ID
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assignment:
 *                   type: object
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get single assignment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher', 'name email')

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    // Teachers can only view their own assignments
    if (req.user.role === 'teacher' && assignment.teacher._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json({
      message: 'Assignment retrieved successfully',
      assignment
    })
  } catch (error) {
    console.error('Get assignment error:', error)
    res.status(500).json({ message: 'Failed to retrieve assignment' })
  }
})

/**
 * @swagger
 * /api/assignments/{id}:
 *   put:
 *     summary: Update assignment (Teacher only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               subject:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 assignment:
 *                   type: object
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update assignment (Teacher only, their own assignments)
router.put('/:id', authenticateToken, requireTeacher, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('subject').optional().trim().notEmpty().withMessage('Subject cannot be empty'),
  body('deadline').optional().isISO8601().withMessage('Valid deadline date is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      })
    }

    const assignment = await Assignment.findById(req.params.id)

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    // Check if teacher owns this assignment
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own assignments' })
    }

    // Update assignment
    const updateData = {}
    if (req.body.title) updateData.title = req.body.title
    if (req.body.description) updateData.description = req.body.description
    if (req.body.subject) updateData.subject = req.body.subject
    if (req.body.deadline) updateData.deadline = new Date(req.body.deadline)

    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('teacher', 'name email')

    res.json({
      message: 'Assignment updated successfully',
      assignment: updatedAssignment
    })
  } catch (error) {
    console.error('Update assignment error:', error)
    res.status(500).json({ message: 'Failed to update assignment' })
  }
})

/**
 * @swagger
 * /api/assignments/{id}:
 *   delete:
 *     summary: Delete assignment (Teacher only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Delete assignment (Teacher only, their own assignments)
router.delete('/:id', authenticateToken, requireTeacher, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' })
    }

    // Check if teacher owns this assignment
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own assignments' })
    }

    await Assignment.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Assignment deleted successfully'
    })
  } catch (error) {
    console.error('Delete assignment error:', error)
    res.status(500).json({ message: 'Failed to delete assignment' })
  }
})

module.exports = router
