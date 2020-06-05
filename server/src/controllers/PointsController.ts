import { Request, Response } from 'express'
import knex from './../database/connection'

class PointsController {

  async create(req: Request, res: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body

    const formattedPhone = '+55' + whatsapp

    const point = {
      image: req.file.filename,
      name,
      email,
      whatsapp: formattedPhone,
      latitude,
      longitude,
      city,
      uf
    }

    console.log(longitude)

    const trx = await knex.transaction()

    const insertedIds = await trx('points').insert(point)

    const point_id = insertedIds[0]

    const pointItems = items.split(',').map((item: string) => Number(item.trim())).map((item_id: number) => {
      return {
        item_id,
        point_id
      }
    })

    await trx('point_items').insert(pointItems)

    await trx.commit()

    return res.json({
      id: point_id,
      ...point,
    })
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const foundedPoint = await knex('points').select('*').where('id', id).first()

    if(!foundedPoint) {
      return res.status(400).json({
        message: 'Point not found.'
      })
    }

    const serializedPoint = {
      ...foundedPoint,
      image_url: `http://192.168.1.9:3333/uploads/${foundedPoint.image}`
    }

    const items = await knex('items').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.point_id', id).select('items.title')

    return res.json({ foundedPoint: serializedPoint, items })
  }

  async index(req: Request, res: Response) {
    const {uf, city, items} = req.query

    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://192.168.1.9:3333/uploads/${point.image}`
        }
      })

      return res.json(serializedPoints)
  }

}

export default PointsController