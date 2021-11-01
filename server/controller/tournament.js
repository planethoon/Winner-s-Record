import "express-async-errors";
import * as tournamentData from "../data/tournament.js";
import * as matchData from "../data/match.js";

export async function getAll(req, res) {
  const docId = parseInt(req.params.docId);
  const doc = await matchData.findDocById(docId);
  const hostId = doc.userId;
  const result = await tournamentData.findByDocId(docId);
  return res.status(200).json({ data: result, hostId });
}

export async function editResult(req, res) {
  const hostId = req.userId;
  const matchId = req.body.matchId;
  const docId = parseInt(req.params.docId);
  const doc = await matchData.findDocById(docId);
  if (hostId !== doc.userId) {
    return res.status(403).json({ message: "권한이 없습니다" });
  }
  const { winner, loser } = req.body;

  await matchData.eidtMatch(matchId, winner, loser);
  const result = await tournamentData.findByDocId(docId);
  return res.status(200).json({ data: result, hostId: doc.userId });
}
