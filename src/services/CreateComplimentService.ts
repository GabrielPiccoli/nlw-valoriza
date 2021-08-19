import { getCustomRepository } from "typeorm"
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories"
import { UserRepositories } from "../repositories/UserRepositories"

interface IComplimentRequest {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
  message: string;
}

class CreateComplimentService {
  async execute({ message, user_sender, user_receiver, tag_id}: IComplimentRequest) {
    const complimentsRepositories = getCustomRepository(ComplimentsRepositories)
    const userRepositories = getCustomRepository(UserRepositories)

    if (user_sender === user_receiver) {
      throw new Error("Incorrect User Receiver")
    }

    const userReceiverExists = await userRepositories.findOne(user_receiver)

    if (!userReceiverExists) {
      throw new Error("User Receiver does not exists")
    }

    const compliment = complimentsRepositories.create({
      tag_id,
      user_sender,
      user_receiver,
      message
    })
    await complimentsRepositories.save(compliment)

    return compliment
  }
}

export { CreateComplimentService }