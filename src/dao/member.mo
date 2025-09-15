import Types "./types";
import Map "mo:map/Map";
import Buffer "mo:base/Buffer";
import { phash } "mo:map/Map";
import { now } "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import SharedTypes "./sharedTypes";

module {

  type LikeProposal = SharedTypes.LikeProposal;
  type Member = SharedTypes.Member;
  type MemberRole = SharedTypes.MemberRole;
  type MemberError = SharedTypes.MemberError;
  type MemberEditableData = SharedTypes.MemberEditableData;

  public type Result = { #Ok : Member; #Err : MemberError };

  public func create_member(state : Types.State, caller : Principal) : Member {
    switch (Map.get<Principal, Member>(state.members, phash, caller)) {
      case null {
        let newMember : Member = {
          name : ?Text = null;
          principal = caller;
          cover_img : ?Blob = null;
          profile_pic : ?Blob = null;
          created_at = now();
          last_activity = now();
          liked_proposals = [];
          role = if (Map.size(state.members) == 0) { #Admin } else { #Observer }; // Lógica heredada de la version Rust. Revisar
        };
        ignore Map.put<Principal, Member>(state.members, phash, caller, newMember);
        newMember;
      };
      case (?member) { member };
    };
  };

  public func edit_member(state : Types.State, caller : Principal, { profile_pic; cover_img; name } : MemberEditableData) : Result {
    switch (Map.get<Principal, Member>(state.members, phash, caller)) {
      case null { #Err(#NotFound) };
      case (?member) {
        let updatedMember : Member = { member with name; profile_pic; cover_img; };
        ignore Map.put<Principal, Member>(state.members, phash, caller, updatedMember);
        #Ok(updatedMember);
      };
    };
  };

  public func is_admin(s: Types.State, p: Principal): Bool{
    switch (Map.get<Principal, Member>(s.members, phash, p)){
      case (?member){ member.role == #Admin};
      case null false;
    }
  };

  public func set_member_role(s: Types.State, p: Principal, new_role: MemberRole): ?MemberError{
    switch (Map.get<Principal, Member>(s.members, phash, p)) {
      case null { ? #NotFound };
      case ( ?member ) {
        if ( member.role == #Admin){
          // TODO C0nsultar por esta acción. En caso del que el usuario sea un admin, se le puede modificar el rol?
        } else {
          ignore Map.put<Principal, Member>(s.members, phash, p, {member with role = new_role});
        };
        null
      }
    }
  };

  public func batch_update_member_role(s: Types.State, member_list: [Principal], new_role: MemberRole): [(Principal, MemberError)] {
    let failsBuffer = Buffer.fromArray<(Principal, MemberError)>([]);
    for(p in member_list.vals()) {
      switch (set_member_role(s, p, new_role)){
        case ( ?error ) {
          failsBuffer.add((p, error))
        };
        case _ {}
      };
    };
    Buffer.toArray(failsBuffer)
  };

  public func get_member(s: Types.State, p: Principal) :  Result{
    switch (Map.get<Principal, Member>(s.members, phash, p)) {
      case null { #Err(#NotFound) };
      case ( ? member ) { #Ok(member)}
    }
  };

  func is_active_member(m: Member): Bool {
    let two_weeks = 2 * 7 * 24 * 60 * 60 * 1_000_000_000;
    m.last_activity + two_weeks > now()
  };

  func is_approved_member(m: Member): Bool {
    switch (m.role) {
      case ( #PendingMember(_) or #Viewer ) { false };
      case _ { true }
    }
  };


  public func get_active_members(s: Types.State): [Member] { // Warning. El límite máximo de 2 MiB puede ser superado facilmente. Paginar response
    let members = Iter.toArray(Map.vals<Principal, Member>(s.members));
    let actives = Array.filter<Member>(
      members, 
      func x = is_active_member(x) and is_approved_member(x)
    );
    Array.map<Member, Member>(
      actives, 
      func x = {x with cover_img = null; profile_pic = null}  // Omitimos las imagenes
    );
  };

  public func get_all_members(s: Types.State) : [Member] { // Warning. El límite máximo de 2 MiB puede ser superado facilmente. Paginar response u omitir imagenes
    let membersArray = Iter.toArray(Map.vals<Principal, Member>(s.members));
    Array.map<Member, Member>(
      membersArray, 
      func x = {x with cover_img = null; profile_pic = null} // Omitimos las imagenes
    ); 
  };

  public func get_total_admins(s: Types.State): Nat {
    var count = 0;
    for (m in Map.vals<Principal, Member>(s.members)){
      if(m.role == #Admin){ count += 1 }
    };
    count
  };

  public func get_role_member(s: Types.State, p: Principal): ?MemberRole {
    switch (Map.get<Principal, Member>(s.members, phash, p)){
      case null null;
      case (?member) {?member.role}
    }
  };

};
