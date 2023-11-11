import express from 'express';
import realChatController from '../controllers/realChatController.js';

const router = express.Router();


router.post('/register', realChatController.userRegistartion);
router.post ('/login', realChatController.userLogIn);

router.post('/conversation', realChatController.newUserConversation);
router.post('/message', realChatController.postUsersMessages);

router.get('/usersdetails', realChatController.userDetails);
router.get('/usersconversation/:userId', realChatController.getUserConversation);
router.get('/message/:conversationId', realChatController.getConversationMsg)

export default router;